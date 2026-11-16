// E2E harness for the shielded-split browser tests (dash-platform-extension#219).
//
// Bundles the built browser entry (dist/src/wasm.js) with esbuild (platform
// browser, ESM, code splitting) and serves it with SWITCHABLE response headers:
//
//   ?profile=none          -> no COOP/COEP (plain site, no cross-origin isolation)
//   ?profile=same-origin   -> COOP: same-origin            + COEP: require-corp
//   ?profile=allow-popups  -> COOP: same-origin-allow-popups + COEP: require-corp
//
// Code splitting keeps the threaded shielded module in its own chunk, fetched
// only when initShielded() runs its dynamic import — so tests can assert lazy
// loading from the request log and from instrumented WebAssembly.Module sizes.
//
// The served page instruments WebAssembly.Module (compiled byte sizes) and
// Worker (spawn count), exposes the SDK namespace as window.__dpp, and has a
// button that window.open()s window.__popupUrl (set by the test) so popup
// references can be probed with a real user gesture.
//
// Usage:
//   import { startE2EServer } from './e2e-server.mjs'   (tests)
//   node scripts/e2e-server.mjs [port]                  (manual debugging)

import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const PROFILES = {
  none: {},
  'same-origin': {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp'
  },
  'allow-popups': {
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Embedder-Policy': 'require-corp'
  }
}

// Node-only builtin referenced (guarded by isNode) in shieldedCreation.cjs.
// In the browser bundle it is dead code; stub it so esbuild can resolve it.
const nodeBuiltinStub = {
  name: 'node-builtin-stub',
  setup (b) {
    b.onResolve({ filter: /^(node:)?worker_threads$/ }, (args) => ({
      path: args.path, namespace: 'node-builtin-stub'
    }))
    b.onLoad({ filter: /.*/, namespace: 'node-builtin-stub' }, () => ({
      contents: 'module.exports = {};', loader: 'js'
    }))
  }
}

// Bundle the dist entry in memory. Returns a Map urlPath -> { content, type }
// plus the entry/shielded chunk paths (the shielded chunk is the dynamic-import
// target that contains shieldedCreation.cjs).
export async function buildBundle () {
  const result = await build({
    entryPoints: [path.join(ROOT, 'dist/src/wasm.js')],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    splitting: true,
    target: ['chrome120'],
    outdir: 'e2e-bundle', // virtual; write:false keeps everything in memory
    write: false,
    metafile: true,
    logLevel: 'warning',
    plugins: [nodeBuiltinStub]
  })

  const files = new Map()
  let entryPath = null
  let shieldedPath = null
  for (const file of result.outputFiles) {
    const urlPath = '/' + path.basename(file.path)
    files.set(urlPath, { content: file.contents, type: 'text/javascript' })
  }
  for (const [name, out] of Object.entries(result.metafile.outputs)) {
    const urlPath = '/' + path.basename(name)
    if (out.entryPoint === 'dist/src/wasm.js') entryPath = urlPath
    if (Object.keys(out.inputs).some((i) => i.includes('shieldedCreation.cjs'))) {
      shieldedPath = urlPath
    }
  }
  if (entryPath == null || shieldedPath == null) {
    throw new Error('e2e bundle: could not identify entry / shielded chunk in esbuild metafile')
  }
  return { files, entryPath, shieldedPath, metafile: result.metafile }
}

function pageHtml (entryPath) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>dpp shielded-split e2e</title></head>
<body>
<button id="popup-btn">open popup</button>
<script>
  // Load-time instrumentation (test d): record every main-thread wasm compile
  // size and every Worker spawn BEFORE the SDK import runs.
  window.__wasmCompiles = [];
  const OrigWasmModule = WebAssembly.Module;
  WebAssembly.Module = class extends OrigWasmModule {
    constructor (bytes) {
      try { window.__wasmCompiles.push(bytes.byteLength ?? bytes.length ?? -1); } catch (e) {}
      super(bytes);
    }
  };
  window.__workers = [];
  const OrigWorker = window.Worker;
  window.Worker = class extends OrigWorker {
    constructor (url, opts) {
      window.__workers.push(String(url).slice(0, 16));
      super(url, opts);
    }
  };
  window.__popupMessages = [];
  window.addEventListener('message', (e) => { window.__popupMessages.push(String(e.data)); });
  document.getElementById('popup-btn').addEventListener('click', () => {
    window.__popup = window.open(window.__popupUrl || '/popup.html', '_blank', 'width=420,height=320');
    window.__popupOpenedAt = Date.now();
  });
</script>
<script type="module">
  try {
    window.__dpp = await import('${entryPath}');
    window.__importDone = true;
  } catch (e) {
    window.__importError = String((e && e.stack) || e);
  }
</script>
</body>
</html>`
}

// Deliberately NO COOP/COEP here: like the wallet-extension popup in #219, the
// popup target is a plain document. Reports whether window.opener survived.
const POPUP_HTML = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>popup:no-opener</title></head>
<body>
<h1>popup target</h1>
<script>
  document.title = 'popup:' + (window.opener != null ? 'has-opener' : 'no-opener');
  window.addEventListener('message', (e) => {
    if (e.source != null) { e.source.postMessage('pong:' + e.data, '*'); }
  });
</script>
</body>
</html>`

// Start a harness server. role 'main' serves the bundle + instrumented page;
// any role serves /popup.html. Start a second instance on another port to get
// a CROSS-ORIGIN popup target (same host, different port = different origin).
export async function startE2EServer ({ port = 0, host = '127.0.0.1' } = {}) {
  const bundle = await buildBundle()
  const requests = [] // { path, status, at } — every request, for lazy/retry asserts
  let failNextShielded = false

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const pathname = url.pathname
    const send = (status, headers, body) => {
      requests.push({ path: pathname, status, at: Date.now() })
      res.writeHead(status, headers)
      res.end(body)
    }

    if (pathname === '/__control/fail-shielded-once') {
      failNextShielded = true
      return send(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' }, 'armed')
    }
    if (pathname === '/__requests') {
      return send(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        JSON.stringify(requests))
    }
    if (pathname === '/popup.html') {
      return send(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }, POPUP_HTML)
    }
    if (pathname === '/' || pathname === '/index.html') {
      const profile = url.searchParams.get('profile') ?? 'none'
      const headers = PROFILES[profile]
      if (headers == null) return send(400, { 'Content-Type': 'text/plain' }, 'unknown profile: ' + profile)
      return send(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        ...headers
      }, pageHtml(bundle.entryPath))
    }
    const file = bundle.files.get(pathname)
    if (file != null) {
      if (pathname === bundle.shieldedPath && failNextShielded) {
        failNextShielded = false
        return send(500, { 'Content-Type': 'text/plain' }, 'simulated shielded chunk load failure (once)')
      }
      return send(200, {
        'Content-Type': file.type,
        'Cache-Control': 'no-store',
        'Cross-Origin-Resource-Policy': 'same-origin'
      }, file.content)
    }
    return send(404, { 'Content-Type': 'text/plain' }, 'not found: ' + pathname)
  })

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, resolve)
  })
  const actualPort = server.address().port
  const origin = `http://${host}:${actualPort}`

  return {
    server,
    port: actualPort,
    origin,
    bundle,
    requests,
    pageUrl: (profile) => `${origin}/?profile=${profile}`,
    popupUrl: `${origin}/popup.html`,
    failNextShieldedOnce: () => { failNextShielded = true },
    close: () => new Promise((resolve) => server.close(resolve))
  }
}

// Standalone mode for manual debugging: node scripts/e2e-server.mjs [port]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] ?? 8123)
  const main = await startE2EServer({ port })
  const popupTarget = await startE2EServer({ port: port + 1 })
  console.log(`main:          ${main.origin}/?profile=none|same-origin|allow-popups`)
  console.log(`popup target:  ${popupTarget.popupUrl} (cross-origin)`)
  console.log(`shielded chunk: ${main.bundle.shieldedPath}`)
  console.log('Ctrl-C to stop')
  process.on('SIGINT', async () => {
    await Promise.all([main.close(), popupTarget.close()])
    process.exit(0)
  })
}