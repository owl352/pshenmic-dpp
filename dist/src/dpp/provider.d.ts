import { DashPlatformProtocol, OrchardProtocol } from '../dpp/types.js';
declare class DppProvider {
    private static instance?;
    private _dpp;
    private _shielded;
    private constructor();
    static getInstance(): DppProvider;
    setDpp(dpp: DashPlatformProtocol): void;
    get dpp(): DashPlatformProtocol;
    setShielded(shielded: OrchardProtocol): void;
    get hasShielded(): boolean;
    /**
     * The shielded (Orchard/Halo 2 proving) module from the separate
     * pshenmic-orchard package, provided explicitly by the consumer via
     * setShielded(loadShielded()). dpp itself carries no proving code.
     */
    get shielded(): OrchardProtocol;
}
export declare const dppProvider: DppProvider;
export {};
