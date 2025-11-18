let dpp;
export function setDpp(_dpp) {
    dpp = _dpp;
}
export class IdentifierWASM {
    /** @private **/
    _rawIdentifier;
    constructor(rawId) {
        if (rawId instanceof IdentifierWASM) {
            return rawId;
        }
        else if (typeof rawId === 'string') {
            const id = {
                type: 'Text',
                field0: rawId
            };
            this._rawIdentifier = new dpp.IdentifierNAPI(id);
        }
        else if (rawId instanceof Uint8Array) {
            const id = {
                type: 'Bytes',
                field0: rawId
            };
            this._rawIdentifier = new dpp.IdentifierNAPI(id);
        }
        else {
            throw new Error('Invalid raw ID');
        }
    }
    base58() {
        return this._rawIdentifier.base58();
    }
    base64() {
        return this._rawIdentifier.base64();
    }
    hex() {
        return this._rawIdentifier.hex();
    }
    bytes() {
        return this._rawIdentifier.bytes();
    }
    static fromBase58(id) {
        return this.createFromRawInstance(dpp.IdentifierNAPI.fromBase58(id));
    }
    static fromBase64(id) {
        return this.createFromRawInstance(dpp.IdentifierNAPI.fromBase64(id));
    }
    static fromHex(id) {
        return this.createFromRawInstance(dpp.IdentifierNAPI.fromHex(id));
    }
    static fromBytes(id) {
        return this.createFromRawInstance(dpp.IdentifierNAPI.fromBytes(id));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(this.prototype);
        instance._rawIdentifier = rawInstance;
        return instance;
    }
    getRawInstance() {
        return this._rawIdentifier;
    }
}
