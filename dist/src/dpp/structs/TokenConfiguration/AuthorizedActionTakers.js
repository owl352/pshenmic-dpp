import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class AuthorizedActionTakersWASM {
    /** @private **/
    _rawAuthorizedActionTakers;
    constructor(authorizedActionTakers) {
        this._rawAuthorizedActionTakers = authorizedActionTakers;
    }
    getTakerType() {
        return this._rawAuthorizedActionTakers.getTakerType();
    }
    getValue() {
        const value = this._rawAuthorizedActionTakers.getValue();
        if (value === undefined) {
            return undefined;
        }
        else if (typeof value === 'number') {
            return Number(value);
        }
        else {
            return IdentifierWASM.createFromRawInstance(value);
        }
    }
    static NoOne() {
        return new AuthorizedActionTakersWASM(dppProvider.dpp.AuthorizedActionTakersNAPI.NoOne());
    }
    static ContractOwner() {
        return new AuthorizedActionTakersWASM(dppProvider.dpp.AuthorizedActionTakersNAPI.ContractOwner());
    }
    static Identity(id) {
        return new AuthorizedActionTakersWASM(dppProvider.dpp.AuthorizedActionTakersNAPI.Identity(prepareIdentifierValue(id)));
    }
    static MainGroup() {
        return new AuthorizedActionTakersWASM(dppProvider.dpp.AuthorizedActionTakersNAPI.MainGroup());
    }
    static Group(groupContractPosition) {
        return new AuthorizedActionTakersWASM(dppProvider.dpp.AuthorizedActionTakersNAPI.Group(groupContractPosition));
    }
    static createFromRawInstance(rawInstance) {
        return new AuthorizedActionTakersWASM(rawInstance);
    }
}
