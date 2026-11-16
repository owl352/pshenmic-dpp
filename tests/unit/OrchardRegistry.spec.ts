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
})
