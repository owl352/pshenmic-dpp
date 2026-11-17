import { dppProvider } from '../../provider.js';
export class OutPointWASM {
    /** @private **/
    _rawOutPoint;
    constructor(txId, vout) {
        this._rawOutPoint = new dppProvider.dpp.OutPointNAPI(txId, vout);
    }
    getVOUT() {
        return this._rawOutPoint.getVOUT();
    }
    getTXID() {
        return this._rawOutPoint.getTXID();
    }
    bytes() {
        return this._rawOutPoint.bytes();
    }
    base64() {
        return this._rawOutPoint.base64();
    }
    hex() {
        return this._rawOutPoint.hex();
    }
    static fromBytes(bytes) {
        const instance = dppProvider.dpp.OutPointNAPI.fromBytes(bytes);
        return OutPointWASM.createFromRawInstance(instance);
    }
    static fromHex(bytes) {
        const instance = dppProvider.dpp.OutPointNAPI.fromHex(bytes);
        return OutPointWASM.createFromRawInstance(instance);
    }
    static fromBase64(bytes) {
        const instance = dppProvider.dpp.OutPointNAPI.fromBase64(bytes);
        return OutPointWASM.createFromRawInstance(instance);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(OutPointWASM.prototype);
        instance._rawOutPoint = rawInstance;
        return instance;
    }
}
