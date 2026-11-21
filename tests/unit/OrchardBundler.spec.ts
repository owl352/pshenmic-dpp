import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// jest runs from the repo root; process.cwd() works in both CJS and native-ESM
// jest modes (__dirname / import.meta are mode-specific).
const ROOT = process.cwd()

// Proves the standalone shielded package survives a real bundler: esbuild
// renames/mangles module identifiers, yet `import { OrchardAddressWASM } from
// 'dash-platform-shielded'` resolves. The bundle is executed natively in a child
// node process (SharedArrayBuffer available).
const SHIELDED_ENTRY = path.join(ROOT, 'node_modules/dash-platform-shielded/dist/src/index.js')

async function runBundle (contents, outdir) {
  const result = await build({
    stdin: { contents, resolveDir: ROOT, loader: 'js' },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node22'],
    outdir,
    outExtension: { '.js': '.cjs' },
    external: ['*.node'],
    // The shielded wrappers compose dpp's base classes. In a browser bundle the
    // package conditions resolve to the wasm entry; force it here too.
    alias: {
      'pshenmic-dpp': path.join(ROOT, 'dist/src/wasm.js')
    },
    nodePaths: [path.join(ROOT, 'node_modules')],
    metafile: true,
    logLevel: 'warning'
  })
  const entry = Object.entries(result.metafile.outputs).find(([, out]) => out.entryPoint === '<stdin>')
  if (entry == null) throw new Error('bundler test: no stdin entry in metafile')
  return spawnSync(process.execPath, [path.join(outdir, path.basename(entry[0]))], { encoding: 'utf8', timeout: 120000 })
}

describe('shielded package under a bundler', function () {
  let outdir

  beforeAll(function () {
    outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'shielded-bundler-'))
  })

  afterAll(function () {
    fs.rmSync(outdir, { recursive: true, force: true })
  })

  test('bundled shielded package builds a working Orchard address', async function () {
    const run = await runBundle(`
import { OrchardAddressWASM, DashPlatformShielded } from ${JSON.stringify(SHIELDED_ENTRY)};
const seed = new Uint8Array(64).fill(7);
try {
  const shielded = new DashPlatformShielded();
  const address = shielded.OrchardAddressWASM.fromSeed(seed, 1, 0);
  console.log('LOAD_OK:' + address.bytes().length);
} catch (e) { console.error('LOAD_FAIL:' + ((e && e.message) || e)); process.exit(1); }
`, path.join(outdir, 'single'))
    expect(run.stdout).toContain('LOAD_OK:')
    expect(run.status).toBe(0)
  }, 120000)
})
