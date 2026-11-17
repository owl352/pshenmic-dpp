// Explicit orchard injection: the consumer imports orchard's loadShielded and
// hands dpp the instance via setShielded(). Both imports are static, so this is
// bundler-renaming robust — no global registry is involved.
import { loadShielded } from 'pshenmic-orchard'
import { setShielded, OrchardAddressWASM, ShieldedBuilderWASM } from 'pshenmic-dpp/wasm'

const SEED = new Uint8Array(64).fill(7)

describe('setShielded (explicit orchard injection)', function () {
  test('orchard exports loadShielded as a function', function () {
    expect(typeof loadShielded).toBe('function')
  })

  test('setShielded(loadShielded()) enables the shielded classes', async function () {
    setShielded(loadShielded())
    const address = OrchardAddressWASM.fromSeed(SEED, 1, 0)
    expect(address.bytes().length).toBe(43)
    const builder = new ShieldedBuilderWASM()
    await builder.init()
    expect(builder).toBeDefined()
  }, 120000)

  test('setShielded rejects a value that is not the orchard instance', function () {
    expect(() => setShielded(null as never)).toThrow(/loadShielded/)
    expect(() => setShielded(42 as never)).toThrow(/loadShielded/)
  })
})