import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// jest runs from the repo root; process.cwd() works in both CJS and native-ESM
// jest modes (__dirname / import.meta are mode-specific).
const ROOT = process.cwd()

// Proves the orchard discovery mechanism survives a real bundler: esbuild
// renames/mangles module identifiers, yet dpp still finds orchard's loader
// because registration uses the cross-realm global symbol
// Symbol.for('pshenmic-dpp.shielded'), not a module name. The bundled output is
// executed NATIVELY in a child node process (SharedArrayBuffer available).
//
// SCOPE: these tests exercise module load + a SYNC shielded class (fromSeed).
// Async proving (builder.init(), which spawns wasm thread workers) under a NODE
// bundle is a known PRE-EXISTING limitation: loader.cjs spawns Node workers via
// new Worker(__filename), and in a bundle __filename is the whole app entry, so
// the worker re-executes the consumer entry instead of the loader. Browser
// proving is unaffected (it uses the self-contained Blob workerBundle). A
// self-contained Node worker (eval + workerBundle source) is the follow-up fix.

const SEED_HEX = '07'.repeat(64)

async function runBundle (contents, outdir) {
  const result = await build({
    stdin: { contents, resolveDir: ROOT, loader: 'js' },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node22'],
    outdir,
    outExtension: { '.js': '.cjs' },
    // Native Node-API addons are never bundled (a bundler cannot inline a .node
    // binary); orchard's loader requires one dynamically and falls back to wasm
    // when it is absent — exactly the browser-bundle path. Externalize them so
    // esbuild does not try to parse the binary as JS.
    external: ['*.node'],
    // The two-copy test bundles dpp copies placed in /tmp; resolve their bare
    // npm imports (@emnapi, wasm-util) from the repo's node_modules.
    nodePaths: [path.join(ROOT, 'node_modules')],
    metafile: true,
    logLevel: 'warning'
  })
  const entry = Object.entries(result.metafile.outputs).find(([, out]) => out.entryPoint === '<stdin>')
  if (entry == null) throw new Error('bundler test: no stdin entry in metafile')
  const bundlePath = path.join(outdir, path.basename(entry[0]))
  const run = spawnSync(process.execPath, [bundlePath], { encoding: 'utf8', timeout: 120000 })
  return run
}

describe('orchard discovery under a bundler', function () {
  let outdir

  beforeAll(function () {
    outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'orchard-bundler-'))
  })

  afterAll(function () {
    fs.rmSync(outdir, { recursive: true, force: true })
  })

  test('bundled dpp discovers orchard and loads a shielded class (renaming-robust)', async function () {
    const run = await runBundle(`
import * as dpp from ${JSON.stringify(path.join(ROOT, 'dist/src/wasm.js'))};
import ${JSON.stringify(path.join(ROOT, 'node_modules/pshenmic-orchard/dist/src/index.cjs'))};
const seed = new Uint8Array(64).fill(7);
(async () => {
  try {
    await dpp.initShielded();
    const address = dpp.OrchardAddressWASM.fromSeed(seed, 1, 0);
    const registered = globalThis[Symbol.for('pshenmic-dpp.shielded')];
    if (typeof registered?.loadShielded !== 'function') throw new Error('loader not registered');
    console.log('LOAD_OK:' + address.bytes().length);
  } catch (e) { console.error('LOAD_FAIL:' + ((e && e.message) || e)); process.exit(1); }
})();
`, path.join(outdir, 'single'))
    expect(run.stdout).toContain('LOAD_OK:')
    expect(run.status).toBe(0)
  }, 120000)

  test('two physical dpp copies in one bundle both discover orchard (duplicate-copy safe)', async function () {
    // Two distinct copies of the built dpp (as a consumer bundling duplicate
    // versions would have), each importing the SAME orchard. Both must discover
    // the one registered loader via the global symbol and agree on output, while
    // remaining distinct module instances.
    const copyA = path.join(outdir, 'dppA')
    const copyB = path.join(outdir, 'dppB')
    const filter = (src) => !src.includes(`${path.sep}native`)
    fs.cpSync(path.join(ROOT, 'dist'), copyA, { recursive: true, filter })
    fs.cpSync(path.join(ROOT, 'dist'), copyB, { recursive: true, filter })

    const run = await runBundle(`
import * as dpp1 from ${JSON.stringify(path.join(copyA, 'src/wasm.js'))};
import * as dpp2 from ${JSON.stringify(path.join(copyB, 'src/wasm.js'))};
import ${JSON.stringify(path.join(ROOT, 'node_modules/pshenmic-orchard/dist/src/index.cjs'))};
const seed = new Uint8Array(${SEED_HEX.match(/../g).map((h) => parseInt(h, 16))});
const toHex = (b) => Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
(async () => {
  try {
    await dpp1.initShielded();
    await dpp2.initShielded();
    if (dpp1.OrchardAddressWASM === dpp2.OrchardAddressWASM) throw new Error('copies are not distinct instances');
    const a1 = dpp1.OrchardAddressWASM.fromSeed(seed, 1, 0);
    const a2 = dpp2.OrchardAddressWASM.fromSeed(seed, 1, 0);
    if (toHex(a1.bytes()) !== toHex(a2.bytes())) throw new Error('copies disagree on address bytes');
    console.log('TWOCOPY_OK');
  } catch (e) { console.error('TWOCOPY_FAIL:' + ((e && e.message) || e)); process.exit(1); }
})();
`, path.join(outdir, 'twocopy'))
    expect(run.stdout).toContain('TWOCOPY_OK')
    expect(run.status).toBe(0)
  }, 120000)
})
