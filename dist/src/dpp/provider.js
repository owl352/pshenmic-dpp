class DppProvider {
    static instance;
    _dpp = null;
    _shielded = null;
    constructor() { }
    static getInstance() {
        if (DppProvider.instance == null) {
            DppProvider.instance = new DppProvider();
        }
        return DppProvider.instance;
    }
    setDpp(dpp) {
        this._dpp = dpp;
    }
    get dpp() {
        if (this._dpp == null) {
            throw new Error('DashPlatformProtocol (dpp) has not been set. Call setDpp() before using SDK classes.');
        }
        return this._dpp;
    }
    setShielded(shielded) {
        this._shielded = shielded;
    }
    get hasShielded() {
        return this._shielded != null;
    }
    /**
     * The shielded (Orchard/Halo 2 proving) module from the separate
     * dash-platform-shielded package, provided explicitly by the consumer via
     * setShielded(shielded). dpp itself carries no proving code.
     */
    get shielded() {
        if (this._shielded == null) {
            throw new Error('The shielded (proving) module has not been loaded. Call setShielded(shielded) first.');
        }
        return this._shielded;
    }
}
export const dppProvider = DppProvider.getInstance();
