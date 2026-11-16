import { initShielded } from 'pshenmic-dpp/wasm'

const REGISTRY_KEY = Symbol.for('pshenmic-dpp.shielded')

describe('pshenmic-orchard registration', function () {
  test('importing orchard registers loadShielded on the global symbol', function () {
    delete (globalThis as Record<symbol, unknown>)[REGISTRY_KEY]

    require('../../packages/orchard/src/index.cjs')

    const registered = (globalThis as Record<symbol, { loadShielded?: unknown }>)[REGISTRY_KEY]
    expect(registered).toBeDefined()
    expect(typeof registered.loadShielded).toEqual('function')
  })

  test('initShielded() rejects with a clear message when orchard is not registered', async function () {
    delete (globalThis as Record<symbol, unknown>)[REGISTRY_KEY]
    await expect(initShielded()).rejects.toThrow(/pshenmic-orchard/)
  })

  test('initShielded() retry succeeds once orchard is registered (failure clears the cache)', async function () {
    // The realistic flow: init called too early (orchard absent) -> rejects and
    // clears the cached promise -> orchard imported -> init called again -> loads.
    delete (globalThis as Record<symbol, unknown>)[REGISTRY_KEY]
    await expect(initShielded()).rejects.toThrow(/pshenmic-orchard/)

    // Fresh module so the registration side-effect re-runs after the delete.
    jest.isolateModules(() => {
      require('../../packages/orchard/src/index.cjs')
    })
    await expect(initShielded()).resolves.toBeUndefined()
  }, 120000)
})
