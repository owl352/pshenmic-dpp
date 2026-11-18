// Explicit shielded-module injection: the consumer imports dash-platform-shielded's
// eager module and hands it to dpp via setShielded(). Both imports are static,
// so this is bundler-renaming robust — no global registry is involved.
import shielded from 'dash-platform-shielded'
import { loadShielded } from 'dash-platform-shielded/lazy'
import { setShielded, ShieldedAddressWASM, ShieldedBuilderWASM } from 'pshenmic-dpp/wasm'

const SEED = new Uint8Array(64).fill(7)

describe('setShielded (explicit shielded-module injection)', function () {
  test('dash-platform-shielded default entry exposes the proving classes', function () {
    expect(shielded.ShieldedBuilderNAPI).toBeDefined()
    expect(shielded.ShieldedAddressNAPI).toBeDefined()
  })

  test('dash-platform-shielded/lazy returns the same cached module', function () {
    expect(loadShielded()).toBe(shielded)
  })

  test('setShielded(shielded) enables the shielded classes', async function () {
    setShielded(shielded)
    const address = ShieldedAddressWASM.fromSeed(SEED, 1, 0)
    expect(address.bytes().length).toBe(43)
    const builder = new ShieldedBuilderWASM()
    await builder.init()
    expect(builder).toBeDefined()
  }, 120000)

  test('setShielded rejects a value that is not the shielded module instance', function () {
    expect(() => setShielded(null as never)).toThrow(/dash-platform-shielded/)
    expect(() => setShielded(42 as never)).toThrow(/dash-platform-shielded/)
  })
})