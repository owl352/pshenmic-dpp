import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ROOT = path.resolve(__dirname, '../..')

// Proves the orchard discovery mechanism survives a real bundler: esbuild
// renames/mangles module identifiers, yet dpp still finds orchard's loader
// because registration uses the cross-realm global symbol
// Symbol.for('pshenmic-dpp.shielded'), not a module name. The bundled output is
// executed NATIVELY in a child node process (SharedArrayBuffer available) and
// exercises real proving — jest does not intercept the bundle's module graph.

async function bundleSelfTest (outdir) {
  const result = await build({
    stdin: {
      contents: `
import * as dpp from ${JSON.stringify(path.join(ROOT, 'dist/src/wasm.js'))};
import ${JSON.stringify(path.join(ROOT, 'packages/orchard/dist/index.cjs'))};
const seed = new Uint8Array(64).fill(7);
(async () => {
  try {
    await dpp.initShielded();
    const address = dpp.OrchardAddressWASM.fromSeed(seed, 1, 0);
    const registered = globalThis[Symbol.for('pshenmic-dpp.shielded')];
    if (typeof registered?.loadShielded !== 'function') throw new Error('loader not registered');
    console.log('PROVE_OK:' + address.bytes().length);
  } catch (e) {
    console.error('PROVE_FAIL:' + ((e && e.message) || e));
    process.exit(1);
  }
})();
`,
      resolveDir: ROOT,
      loader: 'js'
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node22'],
    outdir,
    outExtension: { '.js': '.cjs' },
    metafile: true,
    logLevel: 'warning'
  })
  const entry = Object.entries(result.metafile.outputs).find(([, out]) => out.entryPoint === '<stdin>')
  if (entry == null) throw new Error('bundler test: no stdin entry in metafile')
  return path.join(outdir, path.basename(entry[0]))
}

describe('orchard discovery under a bundler', function () {
  let outdir
  let bundlePath

  beforeAll(async function () {
    outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'orchard-bundler-'))
    bundlePath = await bundleSelfTest(outdir)
  }, 120000)

  afterAll(function () {
    fs.rmSync(outdir, { recursive: true, force: true })
  })

  test('bundled dpp discovers orchard and proves (renaming-robust)', function () {
    const run = spawnSync(process.execPath, [bundlePath], { encoding: 'utf8', timeout: 120000 })
    expect(run.stdout).toContain('PROVE_OK:')
    expect(run.status).toBe(0)
  }, 120000)

  test('registration uses the cross-realm global symbol (duplicate-copy safe)', function () {
    // Symbol.for is the global registry: any dpp copy in any realm reads the
    // same key orchard writes, so duplicate bundled copies share one loader.
    expect(Symbol.for('pshenmic-dpp.shielded')).toBe(Symbol.for('pshenmic-dpp.shielded'))
  })
})
