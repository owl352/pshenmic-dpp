import { VoteWASM } from './Vote.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class MasternodeVoteTransitionWASM {
    /** @private **/
    _rawMasternodeVoteTransition;
    constructor(proTxHash, voterId, vote, nonce, signaturePublicKey, signature) {
        this._rawMasternodeVoteTransition = new dppProvider.dpp.MasternodeVoteTransitionNAPI(prepareIdentifierValue(proTxHash), prepareIdentifierValue(voterId), vote._rawVote, nonce.toString(), signaturePublicKey, signature);
    }
    get proTxHash() {
        return IdentifierWASM.createFromRawInstance(this._rawMasternodeVoteTransition.proTxHash);
    }
    set proTxHash(id) {
        this._rawMasternodeVoteTransition.proTxHash = prepareIdentifierValue(id);
    }
    get voterIdentityId() {
        return IdentifierWASM.createFromRawInstance(this._rawMasternodeVoteTransition.voterIdentityId);
    }
    set voterIdentityId(id) {
        this._rawMasternodeVoteTransition.voterIdentityId = prepareIdentifierValue(id);
    }
    get vote() {
        return VoteWASM.createFromRawInstance(this._rawMasternodeVoteTransition.vote);
    }
    set vote(vote) {
        this._rawMasternodeVoteTransition.vote = vote._rawVote;
    }
    get nonce() {
        return BigInt(this._rawMasternodeVoteTransition.nonce);
    }
    set nonce(nonce) {
        this._rawMasternodeVoteTransition.nonce = nonce.toString();
    }
    get signaturePublicKeyId() {
        return this._rawMasternodeVoteTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(keyId) {
        this._rawMasternodeVoteTransition.signaturePublicKeyId = keyId;
    }
    get signature() {
        return this._rawMasternodeVoteTransition.signature;
    }
    set signature(value) {
        this._rawMasternodeVoteTransition.signature = value;
    }
    get userFeeIncrease() {
        return this._rawMasternodeVoteTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawMasternodeVoteTransition.userFeeIncrease = value;
    }
    get assetLock() {
        const lock = this._rawMasternodeVoteTransition.assetLock;
        if (lock != null) {
            return AssetLockProofWASM.createFromRawInstance(lock);
        }
    }
    get modifiedDataIds() {
        return this._rawMasternodeVoteTransition.modifiedDataIds.map(IdentifierWASM.createFromRawInstance);
    }
    getSignableBytes() {
        return this._rawMasternodeVoteTransition.getSignableBytes();
    }
    bytes() {
        return this._rawMasternodeVoteTransition.bytes();
    }
    hex() {
        return this._rawMasternodeVoteTransition.hex();
    }
    base64() {
        return this._rawMasternodeVoteTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawMasternodeVoteTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return MasternodeVoteTransitionWASM.createFromRawInstance(dppProvider.dpp.MasternodeVoteTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return MasternodeVoteTransitionWASM.createFromRawInstance(dppProvider.dpp.MasternodeVoteTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return MasternodeVoteTransitionWASM.createFromRawInstance(dppProvider.dpp.MasternodeVoteTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return MasternodeVoteTransitionWASM.createFromRawInstance(dppProvider.dpp.MasternodeVoteTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(MasternodeVoteTransitionWASM.prototype);
        instance._rawMasternodeVoteTransition = rawInstance;
        return instance;
    }
}
