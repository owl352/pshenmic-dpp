const { WASI } = require('@tybys/wasm-util');
const { getDefaultContext } = require('@emnapi/runtime');
const { instantiateNapiModuleSync } = require('@emnapi/core');
const { bytes } = require('./wasm/wasmBytes.cjs');
const { decode } = require('../utils/base122.cjs');
const { decompressSync } = require('fflate');
const {Blob} = require("buffer");
const {URL} = require("url");
const {Worker} = require("worker_threads");

const wasmBytes = new Uint8Array(decode(bytes));

const isNode =
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node;

const isBrowser =
  typeof window !== 'undefined' ||
  typeof self !== 'undefined' && !isNode;

let sharedMemory = new WebAssembly.Memory({
  initial: 1000,
  maximum: 2000,
  shared: true
});

const wasi = new WASI({
  version: 'preview1',
  print: (...args) => console.log(...args),
  printErr: (...args) => console.error(...args)
});

const emnapiContext = getDefaultContext();
emnapiContext.feature.supportNewFunction = false;
emnapiContext.feature.supportBigInt = false;

/**
 * =========================
 * WORKER CODE (ISOLATED)
 * =========================
 */
function workerFactory() {
  const { WASI } = require('@tybys/wasm-util');
  const { instantiateNapiModuleSync, MessageHandler } = require('@emnapi/core');
  const { getDefaultContext } = require('@emnapi/runtime');

  const handler = new MessageHandler({
    postMessage: (d) => self.postMessage(d),

    onLoad({ wasmModule, wasmMemory }) {
      const wasi = new WASI({ version: 'preview1' });

      const context = getDefaultContext();
      context.feature.supportNewFunction = false;
      context.feature.supportBigInt = false;

      return instantiateNapiModuleSync(wasmModule, {
        childThread: true,
        wasi,
        context,
        postMessage: (d) => self.postMessage(d),

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

  self.onmessage = (e) => handler.handle({ data: e.data });
}

/**
 * =========================
 * WORKER CREATION (ROBUST)
 * =========================
 */
function createWorker() {
  const workerCode = `(${workerFactory.toString()})()`;

  // ---------------- NODE ----------------
  if (isNode) {
    const { Worker } = require('worker_threads');
    const { Blob } = require('buffer');
    const { URL } = require('url');

    try {
      const blob = new Blob([workerCode], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);

      return new Worker(url, { execArgv: [] });
    } catch (e) {
      // fallback: file-based worker if Blob fails
      const path = require('path');
      return new Worker(path.join(__dirname, 'emnapi-worker.cjs'));
    }
  }

  // ---------------- BROWSER ----------------
  if (typeof Worker !== 'undefined') {
    try {
      const blob = new Blob([workerCode], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      return new Worker(url);
    } catch (e) {
      // no worker support → fallback
      return null;
    }
  }

  return null;
}

const wasm = instantiateNapiModuleSync(
  decompressSync(wasmBytes),
  {
    context: emnapiContext,
    wasi,
    reuseWorker: 0,

    onCreateWorker() {
      return createWorker();
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
  }
);

module.exports = wasm.napiModule.exports;
module.exports.default = wasm.napiModule.exports;
