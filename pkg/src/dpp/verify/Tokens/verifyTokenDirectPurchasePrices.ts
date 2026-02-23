import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedTokenDirectPurchasePrices } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'
import { TokenPricingScheduleWASM } from '../../structs/Batch/TokenPricingSchedule.js'

export function verifyTokenDirectPurchasePrices (
  proof: Uint8Array,
  tokenIds: IdentifierLike[],
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedTokenDirectPurchasePrices {
  const result = dppProvider.dpp.verifyTokenDirectPurchasePrices(
    proof,
    tokenIds.map(prepareIdentifierValue),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    prices: result.prices.map(price => ({
      tokenId: IdentifierWASM.createFromRawInstance(price.id),
      pricingSchedule: price.pricingSchedule != null ? TokenPricingScheduleWASM.createFromRawInstance(price.pricingSchedule) : undefined
    }))
  }
}
