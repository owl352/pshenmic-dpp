import { DashPlatformProtocol } from '../dpp/types.js';
declare class DppProvider {
    private static instance?;
    private _dpp;
    private constructor();
    static getInstance(): DppProvider;
    setDpp(dpp: DashPlatformProtocol): void;
    get dpp(): DashPlatformProtocol;
}
export declare const dppProvider: DppProvider;
export {};
