class DppProvider {
    static instance;
    _dpp = null;
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
}
export const dppProvider = DppProvider.getInstance();
