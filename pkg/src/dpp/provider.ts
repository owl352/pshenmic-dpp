import { DashPlatformProtocol, ShieldedProtocol } from '../dpp/types.js'

class DppProvider {
  private static instance?: DppProvider
  private _dpp: DashPlatformProtocol | null = null
  private _shielded: ShieldedProtocol | null = null

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

  setShielded (shielded: ShieldedProtocol): void {
    this._shielded = shielded
  }

  get hasShielded (): boolean {
    return this._shielded != null
  }

  /**
   * The shielded (Orchard/Halo 2 proving) module from the separate
   * pshenmic-orchard package, provided explicitly by the consumer via
   * setShielded(loadShielded()). dpp itself carries no proving code.
   */
  get shielded (): ShieldedProtocol {
    if (this._shielded == null) {
      throw new Error('The shielded (proving) module has not been loaded. Call setShielded(loadShielded()) first.')
    }
    return this._shielded
  }
}

export const dppProvider = DppProvider.getInstance()
