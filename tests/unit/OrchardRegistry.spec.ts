import { initShielded } from 'pshenmic-dpp/wasm'

const REGISTRY_KEY = Symbol.for('pshenmic-dpp.shielded')
const ORCHARD_ENTRY = '../../packages/orchard/src/index.cjs'

type Registered = { loadShielded?: () => unknown }
const registry = (): Registered | undefined =>
  (globalThis as Record<symbol, Registered | undefined>)[REGISTRY_KEY]
const setRegistry = (value: Registered | undefined): void => {
  (globalThis as Record<symbol, Registered | undefined>)[REGISTRY_KEY] = value
}

describe('pshenmic-orchard registration', function () {
  let loadShielded: () => unknown

  beforeAll(async function () {
    // Dynamic import (not require) so this works in CJS and native-ESM jest.
    const orchard = await import(ORCHARD_ENTRY)
    loadShielded = (orchard.loadShielded ?? orchard.default?.loadShielded) as () => unknown
  })

  test('importing orchard registers loadShielded on the global symbol', function () {
    expect(registry()).toBeDefined()
    expect(typeof registry()?.loadShielded).toEqual('function')
  })

  test('initShielded() rejects with a clear message when orchard is not registered', async function () {
    setRegistry(undefined)
    await expect(initShielded()).rejects.toThrow(/pshenmic-orchard/)
  })

  test('initShielded() retry succeeds once orchard is registered (failure clears the cache)', async function () {
    // Realistic flow: init called too early (orchard absent) -> rejects and
    // clears the cached promise -> orchard registered -> init again -> loads.
    setRegistry(undefined)
    await expect(initShielded()).rejects.toThrow(/pshenmic-orchard/)

    setRegistry({ loadShielded })
    await expect(initShielded()).resolves.toBeUndefined()
  }, 120000)
})
