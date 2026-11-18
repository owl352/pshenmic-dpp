import { DashPlatformProtocol, ShieldedProtocol } from '../dpp/types.js';
declare class DppProvider {
    private static instance?;
    private _dpp;
    private _shielded;
    private constructor();
    static getInstance(): DppProvider;
    setDpp(dpp: DashPlatformProtocol): void;
    get dpp(): DashPlatformProtocol;
    setShielded(shielded: ShieldedProtocol): void;
    get hasShielded(): boolean;
    /**
     * The shielded (Orchard/Halo 2 proving) module from the separate
     * dash-platform-shielded package, provided explicitly by the consumer via
     * setShielded(shielded). dpp itself carries no proving code.
     */
    get shielded(): ShieldedProtocol;
}
export declare const dppProvider: DppProvider;
export {};
