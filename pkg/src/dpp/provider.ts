import { DashPlatformProtocol } from '../dpp/types.js'

class DppProvider {
  private static instance?: DppProvider
  private _dpp: DashPlatformProtocol | null = null
  private _shielded: DashPlatformProtocol | null = null

  private constructor () {}

  static getInstance (): DppProvider {
    if (DppProvider.instance == null) {
      DppProvider.instance = new DppProvider()
    }
    return DppProvider.instance
  }

  setDpp (dpp: DashPlatformProtocol): void {
    this._dpp = dpp
  }

  get dpp (): DashPlatformProtocol {
    if (this._dpp == null) {
      throw new Error('DashPlatformProtocol (dpp) has not been set. Call setDpp() before using SDK classes.')
    }
    return this._dpp
  }

  setShielded (shielded: DashPlatformProtocol): void {
    this._shielded = shielded
  }

  /**
   * The shielded (threaded Orchard/Halo 2 proving) module. On the wasm entry
   * it is loaded on demand by initShielded(); the native entry sets it at
   * import (the addon carries every class in one instance).
   */
  get shielded (): DashPlatformProtocol {
    if (this._shielded == null) {
      throw new Error('The shielded (proving) module has not been loaded. Call initShielded() first.')
    }
    return this._shielded
  }
}

export const dppProvider = DppProvider.getInstance()
