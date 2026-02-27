import { dppProvider } from '../provider.js';
import { prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../utils.js';
import { IdentifierWASM } from './Identifier.js';
import { TokenConfigurationWASM } from './TokenConfiguration/TokenConfiguration.js';
import { GroupWASM } from './TokenConfiguration/Group.js';
export class DataContractWASM {
    /** @private **/
    _rawDataContract;
    constructor(ownerId, identityNonce, schema, definitions, tokens, fullValidation, platformVersion) {
        let normalTokens;
        if (tokens != null) {
            normalTokens = [];
            for (const token of tokens) {
                normalTokens.push([token.position, token.tokenConfiguration._rawTokenConfiguration]);
            }
        }
        this._rawDataContract = new dppProvider.dpp.DataContractNAPI(prepareIdentifierValue(ownerId), identityNonce.toString(), valueToDynamicValue(schema), valueToDynamicValue(definitions), normalTokens, fullValidation, valueToDynamicValue(platformVersion));
    }
    get systemVersion() {
        return this._rawDataContract.systemVersion;
    }
    set systemVersion(value) {
        this._rawDataContract.systemVersion = value;
    }
    get version() {
        return this._rawDataContract.version;
    }
    set version(value) {
        this._rawDataContract.version = value;
    }
    get id() {
        return IdentifierWASM.createFromRawInstance(this._rawDataContract.id);
    }
    set id(value) {
        this._rawDataContract.id = prepareIdentifierValue(value);
    }
    get ownerId() {
        return IdentifierWASM.createFromRawInstance(this._rawDataContract.ownerId);
    }
    set ownerId(value) {
        this._rawDataContract.ownerId = prepareIdentifierValue(value);
    }
    get tokens() {
        const tokens = this._rawDataContract.tokens;
        return tokens.map(([position, token]) => ({
            position,
            tokenConfiguration: TokenConfigurationWASM.createFromRawInstance(token)
        }));
    }
    set tokens(tokens) {
        let normalTokens;
        if (tokens != null) {
            normalTokens = [];
            for (const token of tokens) {
                normalTokens.push([token.position, token.tokenConfiguration._rawTokenConfiguration]);
            }
        }
        this._rawDataContract.tokens = normalTokens;
    }
    get groups() {
        return this._rawDataContract.groups.map(([position, group]) => ({
            position,
            group: GroupWASM.createFromRawInstance(group)
        }));
    }
    set groups(groups) {
        this._rawDataContract.groups = groups.map(({ group, position }) => ([position, group._rawGroup]));
    }
    get description() {
        return this._rawDataContract.description ?? undefined;
    }
    set description(value) {
        this._rawDataContract.description = value;
    }
    get keywords() {
        return this._rawDataContract.keywords;
    }
    set keywords(value) {
        this._rawDataContract.keywords = value;
    }
    getSchemas() {
        return valueFromDynamicValue(this._rawDataContract.getSchemas());
    }
    getConfig() {
        return valueFromDynamicValue(this._rawDataContract.getConfig());
    }
    setConfig(value, platformVersion) {
        this._rawDataContract.setConfig(valueToDynamicValue(value), valueToDynamicValue(platformVersion));
    }
    bytes(platformVersion) {
        return this._rawDataContract.bytes(valueToDynamicValue(platformVersion));
    }
    hex(platformVersion) {
        return this._rawDataContract.hex(valueToDynamicValue(platformVersion));
    }
    base64(platformVersion) {
        return this._rawDataContract.base64(valueToDynamicValue(platformVersion));
    }
    toJSON(platformVersion) {
        return this._rawDataContract.toJson(valueToDynamicValue(platformVersion));
    }
    toValue(platformVersion) {
        return valueFromDynamicValue(this._rawDataContract.toValue(valueToDynamicValue(platformVersion)));
    }
    static fromValue(value, fullValidation, platformVersion) {
        return DataContractWASM.createFromRawInstance(dppProvider.dpp.DataContractNAPI.fromValue(valueToDynamicValue(value), fullValidation, valueToDynamicValue(platformVersion)));
    }
    static fromBytes(bytes, fullValidation, platformVersion) {
        return DataContractWASM.createFromRawInstance(dppProvider.dpp.DataContractNAPI.fromBytes(bytes, fullValidation, valueToDynamicValue(platformVersion)));
    }
    static fromHex(hex, fullValidation, platformVersion) {
        return DataContractWASM.createFromRawInstance(dppProvider.dpp.DataContractNAPI.fromHex(hex, fullValidation, valueToDynamicValue(platformVersion)));
    }
    static fromBase64(base64, fullValidation, platformVersion) {
        return DataContractWASM.createFromRawInstance(dppProvider.dpp.DataContractNAPI.fromBase64(base64, fullValidation, valueToDynamicValue(platformVersion)));
    }
    static generateId(ownerId, identityNonce) {
        return IdentifierWASM.createFromRawInstance(dppProvider.dpp.DataContractNAPI.generateId(prepareIdentifierValue(ownerId), identityNonce.toString()));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DataContractWASM.prototype);
        instance._rawDataContract = rawInstance;
        return instance;
    }
}
