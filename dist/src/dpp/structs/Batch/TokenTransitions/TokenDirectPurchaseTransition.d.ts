import type { TokenDirectPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
export declare class TokenDirectPurchaseTransitionWASM {
    /** @private **/
    _rawTransition: TokenDirectPurchaseTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, tokenCount: bigint, totalAgreedPrice: bigint);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get tokenCount(): bigint;
    set tokenCount(value: bigint);
    get totalAgreedPrice(): bigint;
    set totalAgreedPrice(value: bigint);
    static createFromRawInstance(rawInstance: TokenDirectPurchaseTransitionNAPI): TokenDirectPurchaseTransitionWASM;
}
