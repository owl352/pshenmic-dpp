import {DashPlatformProtocol} from "../types.js";

class DppProvider {
  private static instance: DppProvider;
  private _dpp: DashPlatformProtocol | null = null;

  private constructor() {}

  public static getInstance(): DppProvider {
    if (!DppProvider.instance) {
      DppProvider.instance = new DppProvider();
    }
    return DppProvider.instance;
  }

  public setDpp(dpp: DashPlatformProtocol): void {
    this._dpp = dpp;
  }

  public getDpp(): DashPlatformProtocol {
    if (!this._dpp) {
      throw new Error('DashPlatformProtocol (dpp) has not been set. Call setDpp() before using SDK classes.');
    }
    return this._dpp;
  }
}

export const dppProvider = DppProvider.getInstance();
