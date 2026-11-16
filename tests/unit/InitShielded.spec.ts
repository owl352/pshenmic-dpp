import 'pshenmic-orchard'
import {
  initShielded,
  IdentifierWASM,
  OrchardAddressWASM,
  OrchardProverWASM,
  ShieldedBuilderWASM
} from 'pshenmic-dpp/wasm'
// Same provider singleton the wasm entry wires (dist is what jest resolves
// 'pshenmic-dpp/wasm' to); used to assert that repeated initShielded() calls
// share ONE shielded module instance.
import { dppProvider } from '../../dist/src/dpp/provider.js'

// Gate tests for the on-demand shielded (threaded proving) module on the WASM
// entry. The base loads at import WITHOUT cross-origin isolation; proving
// classes only exist after `await initShielded()` (dash-platform-extension#219).
//
// Order matters: the "before init" gates must run before any successful
// initShielded() in this file (jest keeps one module registry per test file).

const SEED = new Uint8Array(64).fill(7)

describe('initShielded (wasm entry)', function () {
  let shieldedInstance: unknown

  test('base classes work without initShielded (no cross-origin isolation needed)', function () {
    const bytes = Uint8Array.from([
      9, 40, 40, 237, 192, 129, 211, 186, 26, 84, 240, 67, 37, 155, 148, 19,
      104, 242, 199, 24, 136, 27, 6, 169, 211, 71, 136, 59, 33, 191, 227, 19
    ])
    const identifier = IdentifierWASM.fromBytes(bytes)
    expect(identifier.bytes()).toEqual(bytes)
  })

  test('ShieldedBuilderWASM.init() rejects before initShielded()', async function () {
    await expect(new ShieldedBuilderWASM().init()).rejects.toThrow(/initShielded/)
  })

  test('OrchardProverWASM.init() rejects before initShielded()', async function () {
    await expect(new OrchardProverWASM().init()).rejects.toThrow(/initShielded/)
  })

  test('shielded-local data wrappers throw before initShielded()', function () {
    expect(() => OrchardAddressWASM.fromSeed(SEED, 1, 0)).toThrow(/initShielded/)
  })

  test('initShielded() rejects without SharedArrayBuffer (cross-origin isolation)', async function () {
    const originalSAB = globalThis.SharedArrayBuffer
    try {
      // Simulate a browser without cross-origin isolation (COOP/COEP).
      globalThis.SharedArrayBuffer = undefined as unknown as typeof SharedArrayBuffer
      await expect(initShielded()).rejects.toThrow(/cross-origin isolation|SharedArrayBuffer/)
    } finally {
      globalThis.SharedArrayBuffer = originalSAB
    }
    // The failed attempt must not poison the cache: a later real init works
    // (proven by the next test).
  })

  test('initShielded() then ShieldedBuilderWASM.init() works', async function () {
    // Concurrent calls during the first load must share one load.
    await Promise.all([initShielded(), initShielded()])

    const builder = new ShieldedBuilderWASM()
    await builder.init()
    expect(builder._rawShieldedBuilder).toBeDefined()

    shieldedInstance = dppProvider.shielded
    expect(shieldedInstance).toBeDefined()
  }, 120000)

  test('initShielded() is idempotent: repeated calls return the same promise and instance', async function () {
    const first = initShielded()
    const second = initShielded()
    expect(first).toBe(second)
    await first
    await initShielded()
    expect(dppProvider.shielded).toBe(shieldedInstance)
  })
})
