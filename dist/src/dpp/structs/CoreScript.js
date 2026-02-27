import { dppProvider } from '../provider.js';
import { valueToDynamicValue } from '../utils.js';
export class CoreScriptWASM {
    _rawCoreScript;
    toAddress(network) {
        return this._rawCoreScript.toAddress(valueToDynamicValue(network));
    }
    toString() {
        return this._rawCoreScript.toString();
    }
    bytes() {
        return this._rawCoreScript.bytes();
    }
    hex() {
        return this._rawCoreScript.hex();
    }
    base64() {
        return this._rawCoreScript.base64();
    }
    ASMString() {
        return this._rawCoreScript.ASMString();
    }
    static fromBytes(bytes) {
        return CoreScriptWASM.createFromRawInstance(dppProvider.dpp.CoreScriptNAPI.fromBytes(bytes));
    }
    static newP2PKH(keyHash) {
        return CoreScriptWASM.createFromRawInstance(dppProvider.dpp.CoreScriptNAPI.newP2PKH(keyHash));
    }
    static newP2SH(scriptHash) {
        return CoreScriptWASM.createFromRawInstance(dppProvider.dpp.CoreScriptNAPI.newP2SH(scriptHash));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(CoreScriptWASM.prototype);
        instance._rawCoreScript = rawInstance;
        return instance;
    }
}
