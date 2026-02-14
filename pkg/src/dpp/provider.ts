import {DashPlatformProtocol} from "../dpp/types.js";

class DppProvider {
  private static instance: DppProvider;
  private _dpp: DashPlatformProtocol | null = null;

  private constructor() {}

  static getInstance(): DppProvider {
    if (!DppProvider.instance) {
      DppProvider.instance = new DppProvider();
    }
    return DppProvider.instance;
  }

  setDpp(dpp: DashPlatformProtocol): void {
    this._dpp = dpp;
  }

  get dpp(): DashPlatformProtocol {
    if (!this._dpp) {
      throw new Error('DashPlatformProtocol (dpp) has not been set. Call setDpp() before using SDK classes.');
    }
    return this._dpp;
  }
}

export const dppProvider = DppProvider.getInstance();
