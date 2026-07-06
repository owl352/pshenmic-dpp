const { WASI } = require('@tybys/wasm-util');
const { getDefaultContext } = require('@emnapi/runtime');
const { instantiateNapiModuleSync, MessageHandler } = require('@emnapi/core');

const emnapiContext = getDefaultContext();
emnapiContext.feature.supportNewFunction = false;
emnapiContext.feature.supportBigInt = false;

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
const nodeWorkerThreads = isNode ? require('worker_threads') : null;
const isWorker = isNode
  ? !nodeWorkerThreads.isMainThread
  : (typeof self !== 'undefined' && !self.document);

if (isWorker) {
  // wasi pthread worker: the main thread posts the compiled module + shared
  // memory here and this instantiates a child-thread copy over them. Async
  // `#[napi]` fns (the Halo 2 proving stack) run on these threads.
  const postMsg = isNode
    ? (d) => nodeWorkerThreads.parentPort.postMessage(d)
    : (d) => self.postMessage(d);

  if (isNode) {
    // emnapi's threadsafe-function dispatch calls the bare global
    // `postMessage` from pthread contexts (a Web Worker global); Node
    // worker_threads doesn't have it, so polyfill with parentPort.
    globalThis.self = globalThis;
    globalThis.postMessage = postMsg;
  }

  const handler = new MessageHandler({
    postMessage: postMsg,
    onLoad({ wasmModule, wasmMemory }) {
      const wasi = new WASI({ version: 'preview1' });

      return instantiateNapiModuleSync(wasmModule, {
        childThread: true,
        wasi,
        context: emnapiContext,
        postMessage: postMsg,
        overwriteImports(importObject) {
          importObject.env = {
            ...importObject.env,
            ...importObject.napi,
            ...importObject.emnapi,
            memory: wasmMemory
          };
        }
      });
    }
  });

  if (isNode) {
    nodeWorkerThreads.parentPort.on('message', (data) => handler.handle({ data }));
  } else {
    self.onmessage = (e) => handler.handle({ data: e.data });
  }

  module.exports = null;
} else {
  // Main thread only. This block must NEVER run in a worker: it decodes,
  // decompresses and sync-compiles the whole 7.5MB module and allocates a
  // fresh 64MB shared memory — workers receive the already-compiled module
  // and the real memory via the 'load' message instead. Running it per
  // worker multiplies init time by the core count (rayon spawns one thread
  // per core while building the proving key).
  const { bytes } = require('./wasm/wasmBytes.cjs');
  const { decode } = require('../utils/base122.cjs');
  const { decompressSync } = require('fflate');
  const { default: sharedMemory } = require('./memory.cjs');

  const wasmBytes = new Uint8Array(decode(bytes));

  const wasi = new WASI({
    version: 'preview1',
    print: function () {
      console.log.apply(console, arguments);
    },
    printErr: function () {
      console.error.apply(console, arguments);
    }
  });

  let workerBlobUrl;

  const wasm = instantiateNapiModuleSync(decompressSync(wasmBytes), {
    context: emnapiContext,
    wasi,
    // Threads are spawned lazily (first async `#[napi]` call), so
    // instantiation stays synchronous: emnapi only forbids sync loading
    // with a PREloaded worker pool (`reuseWorker.size > 0`). `true` keeps
    // size 0 but returns finished workers to a pool instead of
    // terminating them, so repeated proving calls reuse them.
    reuseWorker: true,
    onCreateWorker() {
      if (isNode) {
        return new nodeWorkerThreads.Worker(__filename);
      }
      // Escape hatch for hosts that want to control worker creation
      // (e.g. strict CSP environments where blob: workers are forbidden).
      if (typeof globalThis.__PSHENMIC_DPP_CREATE_WORKER__ === 'function') {
        return globalThis.__PSHENMIC_DPP_CREATE_WORKER__();
      }
      if (typeof Worker === 'undefined') {
        throw new Error(
          'Cannot create a wasm thread worker: no Worker constructor in this environment. ' +
          'Provide globalThis.__PSHENMIC_DPP_CREATE_WORKER__ returning a Worker running workerBundle.cjs `source`.'
        );
      }
      // Self-contained worker (all emnapi deps inlined) spawned from a Blob
      // URL, so it survives being bundled into a single file: the worker
      // receives the compiled module + shared memory via postMessage and
      // needs no access to this script's URL or the wasm bytes.
      if (workerBlobUrl === undefined) {
        const { source } = require('./wasm/workerBundle.cjs');
        workerBlobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      }
      return new Worker(workerBlobUrl, { name: 'pshenmic-dpp-wasm-thread' });
    },
    overwriteImports(importObject) {
      importObject.env = {
        ...importObject.env,
        ...importObject.napi,
        ...importObject.emnapi,
        memory: sharedMemory
      };
    },
    beforeInit({ instance }) {
      for (const name of Object.keys(instance.exports)) {
        if (name.startsWith('__napi_register__')) {
          instance.exports[name]();
        }
      }
    }
  });

  module.exports = wasm.napiModule.exports;
  module.exports.default = wasm.napiModule.exports;
}
