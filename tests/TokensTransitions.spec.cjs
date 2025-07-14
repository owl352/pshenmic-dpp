const { describe, it, before } = require('mocha')
const assert = require('assert')
const { dataContractId, ownerId } = require('./mocks/Document/index.js')
const { default: wasm } = require('..')

let baseTransition

describe('TokenTransitions', function () {
  before(async function () {
    baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)
  })

  describe('serialize/deserialize', function () {
    it('should allow to create burn transition', function () {
      const burnTransition = new wasm.TokenBurnTransitionWASM(baseTransition, BigInt(11), 'bbbb')

      assert.equal(burnTransition.constructor.name, 'TokenBurnTransitionWASM')
      assert.notEqual(burnTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create mint transition', function () {
      const mintTransition = new wasm.TokenMintTransitionWASM(baseTransition, ownerId, BigInt(11), 'bbbb')

      assert.equal(mintTransition.constructor.name, 'TokenMintTransitionWASM')
      assert.notEqual(mintTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create transfer transition', function () {
      const transferTransition = new wasm.TokenTransferTransitionWASM(
        baseTransition,
        ownerId,
        BigInt(11),
        'bbbb'
      )

      assert.equal(transferTransition.constructor.name, 'TokenTransferTransitionWASM')
      assert.notEqual(transferTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create transfer transition with shared encrypted note', function () {
      const sharedEncryptedNote = new wasm.SharedEncryptedNoteWASM(0, 0, [0, 0, 0])

      const transferTransition = new wasm.TokenTransferTransitionWASM(
        baseTransition,
        ownerId,
        BigInt(11),
        'bbbb',
        sharedEncryptedNote
      )

      assert.equal(sharedEncryptedNote.constructor.name, 'SharedEncryptedNoteWASM')
      assert.equal(transferTransition.constructor.name, 'TokenTransferTransitionWASM')
      assert.notEqual(transferTransition.__wbg_ptr, 0)
      assert.notEqual(sharedEncryptedNote.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create transfer transition with private encrypted note', function () {
      const privateEncryptedNote = new wasm.PrivateEncryptedNoteWASM(0, 0, [0, 0, 0])

      const transferTransition = new wasm.TokenTransferTransitionWASM(
        baseTransition,
        ownerId,
        BigInt(11),
        'bbbb',
        undefined,
        privateEncryptedNote
      )

      assert.equal(privateEncryptedNote.constructor.name, 'PrivateEncryptedNoteWASM')
      assert.equal(transferTransition.constructor.name, 'TokenTransferTransitionWASM')
      assert.notEqual(transferTransition.__wbg_ptr, 0)
      assert.notEqual(privateEncryptedNote.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create freeze transition', function () {
      const freezeTransition = new wasm.TokenFreezeTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      assert.equal(freezeTransition.constructor.name, 'TokenFreezeTransitionWASM')
      assert.notEqual(freezeTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create unfreeze transition', function () {
      const unfreezeTransition = new wasm.TokenUnFreezeTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      assert.equal(unfreezeTransition.constructor.name, 'TokenUnFreezeTransitionWASM')
      assert.notEqual(unfreezeTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create destroy frozen funds transition', function () {
      const tokenDestroyFrozenFundsTransition = new wasm.TokenDestroyFrozenFundsTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      assert.equal(tokenDestroyFrozenFundsTransition.constructor.name, 'TokenDestroyFrozenFundsTransitionWASM')
      assert.notEqual(tokenDestroyFrozenFundsTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create claim transition', function () {
      const claimTransition = new wasm.TokenClaimTransitionWASM(
        baseTransition,
        wasm.TokenDistributionTypeWASM.PreProgrammed,
        'bbbb'
      )

      assert.equal(claimTransition.constructor.name, 'TokenClaimTransitionWASM')
      assert.notEqual(claimTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create claim transition without distribution type', function () {
      const claimTransition = new wasm.TokenClaimTransitionWASM(
        baseTransition
      )

      assert.equal(claimTransition.constructor.name, 'TokenClaimTransitionWASM')
      assert.notEqual(claimTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create emergency action transition', function () {
      const emergencyActionTransition = new wasm.TokenEmergencyActionTransitionWASM(
        baseTransition,
        wasm.TokenDistributionTypeWASM.PreProgrammed,
        'bbbb'
      )

      assert.equal(emergencyActionTransition.constructor.name, 'TokenEmergencyActionTransitionWASM')
      assert.notEqual(emergencyActionTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create config update transition', function () {
      const tradeMode = wasm.TokenTradeModeWASM.NotTradeable()

      const configUpdateTransition = new wasm.TokenConfigUpdateTransitionWASM(
        baseTransition,
        wasm.TokenConfigurationChangeItemWASM.MarketplaceTradeModeItem(tradeMode),
        'bbbb'
      )

      assert.equal(configUpdateTransition.constructor.name, 'TokenConfigUpdateTransitionWASM')
      assert.notEqual(configUpdateTransition.__wbg_ptr, 0)
      assert.notEqual(tradeMode.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create direct purchase transition', function () {
      const directPurchaseTransition = new wasm.TokenDirectPurchaseTransitionWASM(
        baseTransition,
        BigInt(111),
        BigInt(111)
      )

      assert.equal(directPurchaseTransition.constructor.name, 'TokenDirectPurchaseTransitionWASM')
      assert.notEqual(directPurchaseTransition.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })

    it('should allow to create set price direct purchase transition', function () {
      const price = wasm.TokenPricingScheduleWASM.SetPrices({ 100: 1000 })

      const setPriceDirectPurchaseTransition = new wasm.TokenSetPriceForDirectPurchaseTransitionWASM(
        baseTransition,
        price,
        'bbbb'
      )

      assert.equal(price.constructor.name, 'TokenPricingScheduleWASM')
      assert.equal(setPriceDirectPurchaseTransition.constructor.name, 'TokenSetPriceForDirectPurchaseTransitionWASM')
      assert.notEqual(setPriceDirectPurchaseTransition.__wbg_ptr, 0)
      assert.notEqual(price.__wbg_ptr, 0)
      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })
  })

  describe('getters', () => {
    it('should allow to read getters burn transition', function () {
      const burnTransition = new wasm.TokenBurnTransitionWASM(baseTransition, BigInt(11), 'bbbb')

      assert.equal(burnTransition.burnAmount, BigInt(11))
      assert.equal(burnTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(burnTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters mint transition', function () {
      const mintTransition = new wasm.TokenMintTransitionWASM(baseTransition, ownerId, BigInt(11), 'bbbb')

      assert.equal(mintTransition.amount, BigInt(11))
      assert.equal(mintTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(mintTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters transfer transition', function () {
      const sharedEncryptedNote = new wasm.SharedEncryptedNoteWASM(0, 0, [0, 0, 0])
      const privateEncryptedNote = new wasm.PrivateEncryptedNoteWASM(0, 0, [0, 0, 0])

      const transferTransition = new wasm.TokenTransferTransitionWASM(
        baseTransition,
        ownerId,
        BigInt(11),
        'bbbb',
        sharedEncryptedNote,
        privateEncryptedNote
      )

      assert.equal(transferTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(transferTransition.amount, BigInt(11))
      assert.equal(transferTransition.publicNote, 'bbbb')
      assert.equal(transferTransition.sharedEncryptedNote.constructor.name, 'SharedEncryptedNoteWASM')
      assert.equal(transferTransition.privateEncryptedNote.constructor.name, 'PrivateEncryptedNoteWASM')
    })

    it('should allow to read getters freeze transition', function () {
      const freezeTransition = new wasm.TokenFreezeTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      assert.equal(freezeTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(freezeTransition.frozenIdentityId.base58(), ownerId)
      assert.equal(freezeTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters unfreeze transition', function () {
      const unfreezeTransition = new wasm.TokenUnFreezeTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      assert.equal(unfreezeTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(unfreezeTransition.frozenIdentityId.base58(), ownerId)
      assert.equal(unfreezeTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters destroy frozen funds transition', function () {
      const tokenDestroyFrozenFundsTransition = new wasm.TokenDestroyFrozenFundsTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      assert.equal(tokenDestroyFrozenFundsTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(tokenDestroyFrozenFundsTransition.frozenIdentityId.base58(), ownerId)
      assert.equal(tokenDestroyFrozenFundsTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters claim transition', function () {
      const claimTransition = new wasm.TokenClaimTransitionWASM(
        baseTransition,
        wasm.TokenDistributionTypeWASM.PreProgrammed,
        'bbbb'
      )

      assert.equal(claimTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(claimTransition.distributionType, 'PreProgrammed')
      assert.equal(claimTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters emergency action transition', function () {
      const emergencyActionTransition = new wasm.TokenEmergencyActionTransitionWASM(
        baseTransition,
        wasm.TokenEmergencyActionWASM.Pause,
        'bbbb'
      )

      assert.equal(emergencyActionTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(emergencyActionTransition.emergencyAction, 'Pause')
      assert.equal(emergencyActionTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters config update transition', function () {
      const tradeMode = wasm.TokenTradeModeWASM.NotTradeable()

      const configUpdateTransition = new wasm.TokenConfigUpdateTransitionWASM(
        baseTransition,
        wasm.TokenConfigurationChangeItemWASM.MarketplaceTradeModeItem(tradeMode),
        'bbbb'
      )

      assert.equal(configUpdateTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(configUpdateTransition.updateTokenConfigurationItem.constructor.name, 'TokenConfigurationChangeItemWASM')
      assert.equal(configUpdateTransition.publicNote, 'bbbb')
    })

    it('should allow to read getters direct purchase transition', function () {
      const directPurchaseTransition = new wasm.TokenDirectPurchaseTransitionWASM(
        baseTransition,
        BigInt(111),
        BigInt(111)
      )

      assert.equal(directPurchaseTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(directPurchaseTransition.tokenCount, BigInt(111))
      assert.equal(directPurchaseTransition.totalAgreedPrice, BigInt(111))
    })

    it('should allow to read getters set price direct purchase transition', function () {
      const price = wasm.TokenPricingScheduleWASM.SetPrices({ 100: 1000 })

      const setPriceDirectPurchaseTransition = new wasm.TokenSetPriceForDirectPurchaseTransitionWASM(
        baseTransition,
        price,
        'bbbb'
      )

      assert.equal(setPriceDirectPurchaseTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(setPriceDirectPurchaseTransition.price.constructor.name, 'TokenPricingScheduleWASM')
      assert.equal(setPriceDirectPurchaseTransition.publicNote, 'bbbb')
    })
  })

  describe('setters', () => {
    it('should allow to set values burn transition', function () {
      const burnTransition = new wasm.TokenBurnTransitionWASM(baseTransition, BigInt(11), 'bbbb')

      burnTransition.burnAmount = BigInt(222)
      burnTransition.publicNote = 'aaaa'

      assert.equal(burnTransition.burnAmount, BigInt(222))
      assert.equal(burnTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(burnTransition.publicNote, 'aaaa')
    })

    it('should allow to set values mint transition', function () {
      const mintTransition = new wasm.TokenMintTransitionWASM(baseTransition, ownerId, BigInt(11), 'bbbb')

      mintTransition.amount = BigInt(222)
      mintTransition.publicNote = 'aaaa'

      assert.equal(mintTransition.amount, BigInt(222))
      assert.equal(mintTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(mintTransition.publicNote, 'aaaa')
    })

    it('should allow to set values transfer transition', function () {
      const sharedEncryptedNote = new wasm.SharedEncryptedNoteWASM(0, 0, [0, 0, 0])
      const privateEncryptedNote = new wasm.PrivateEncryptedNoteWASM(0, 0, [0, 0, 0])

      const transferTransition = new wasm.TokenTransferTransitionWASM(
        baseTransition,
        ownerId,
        BigInt(11),
        'bbbb',
        sharedEncryptedNote,
        privateEncryptedNote
      )

      const sharedEncryptedNote2 = new wasm.SharedEncryptedNoteWASM(0, 0, [0, 0, 0])
      const privateEncryptedNote2 = new wasm.PrivateEncryptedNoteWASM(0, 0, [0, 0, 0])

      transferTransition.sharedEncryptedNote = sharedEncryptedNote2
      transferTransition.privateEncryptedNote = privateEncryptedNote2
      transferTransition.amount = BigInt(222)
      transferTransition.publicNote = 'aaaa'

      assert.equal(transferTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(transferTransition.amount, BigInt(222))
      assert.equal(transferTransition.publicNote, 'aaaa')
      assert.equal(transferTransition.sharedEncryptedNote.constructor.name, 'SharedEncryptedNoteWASM')
      assert.equal(transferTransition.privateEncryptedNote.constructor.name, 'PrivateEncryptedNoteWASM')
      assert.notEqual(sharedEncryptedNote2.__wbg_ptr, 0)
      assert.notEqual(privateEncryptedNote2.__wbg_ptr, 0)
    })

    it('should allow to set values freeze transition', function () {
      const freezeTransition = new wasm.TokenFreezeTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      freezeTransition.frozenIdentityId = dataContractId
      freezeTransition.publicNote = 'aaaa'

      assert.equal(freezeTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(freezeTransition.frozenIdentityId.base58(), dataContractId)
      assert.equal(freezeTransition.publicNote, 'aaaa')
    })

    it('should allow to set values unfreeze transition', function () {
      const unfreezeTransition = new wasm.TokenUnFreezeTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      unfreezeTransition.frozenIdentityId = dataContractId
      unfreezeTransition.publicNote = 'aaaa'

      assert.equal(unfreezeTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(unfreezeTransition.frozenIdentityId.base58(), dataContractId)
      assert.equal(unfreezeTransition.publicNote, 'aaaa')
    })

    it('should allow to set values destroy frozen funds transition', function () {
      const tokenDestroyFrozenFundsTransition = new wasm.TokenDestroyFrozenFundsTransitionWASM(
        baseTransition,
        ownerId,
        'bbbb'
      )

      tokenDestroyFrozenFundsTransition.frozenIdentityId = dataContractId
      tokenDestroyFrozenFundsTransition.publicNote = 'aaaa'

      assert.equal(tokenDestroyFrozenFundsTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(tokenDestroyFrozenFundsTransition.frozenIdentityId.base58(), dataContractId)
      assert.equal(tokenDestroyFrozenFundsTransition.publicNote, 'aaaa')
    })

    it('should allow to set values claim transition', function () {
      const claimTransition = new wasm.TokenClaimTransitionWASM(
        baseTransition,
        wasm.TokenDistributionTypeWASM.Perpetual,
        'bbbb'
      )

      claimTransition.distributionType = wasm.TokenDistributionTypeWASM.Perpetual
      claimTransition.publicNote = 'aaaa'

      assert.equal(claimTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(claimTransition.distributionType, 'Perpetual')
      assert.equal(claimTransition.publicNote, 'aaaa')
    })

    it('should allow to set values emergency action transition', function () {
      const emergencyActionTransition = new wasm.TokenEmergencyActionTransitionWASM(
        baseTransition,
        wasm.TokenEmergencyActionWASM.Pause,
        'bbbb'
      )

      emergencyActionTransition.emergencyAction = wasm.TokenEmergencyActionWASM.Resume
      emergencyActionTransition.publicNote = 'aaaa'

      assert.equal(emergencyActionTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(emergencyActionTransition.emergencyAction, 'Resume')
      assert.equal(emergencyActionTransition.publicNote, 'aaaa')
    })

    it('should allow to set values config update transition', function () {
      // At this moment available only one trade mode
      const tradeMode = wasm.TokenTradeModeWASM.NotTradeable()

      const configUpdateTransition = new wasm.TokenConfigUpdateTransitionWASM(
        baseTransition,
        wasm.TokenConfigurationChangeItemWASM.MarketplaceTradeModeItem(tradeMode),
        'bbbb'
      )

      configUpdateTransition.publicNote = 'aaaa'

      assert.equal(configUpdateTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(configUpdateTransition.updateTokenConfigurationItem.constructor.name, 'TokenConfigurationChangeItemWASM')
      assert.equal(configUpdateTransition.publicNote, 'aaaa')
    })

    it('should allow to set values direct purchase transition', function () {
      const directPurchaseTransition = new wasm.TokenDirectPurchaseTransitionWASM(
        baseTransition,
        BigInt(111),
        BigInt(111)
      )

      directPurchaseTransition.tokenCount = BigInt(222)
      directPurchaseTransition.totalAgreedPrice = BigInt(222)

      assert.equal(directPurchaseTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(directPurchaseTransition.tokenCount, BigInt(222))
      assert.equal(directPurchaseTransition.totalAgreedPrice, BigInt(222))
    })

    it('should allow to set values set price direct purchase transition', function () {
      const price = wasm.TokenPricingScheduleWASM.SetPrices({ 100: 1000 })

      const setPriceDirectPurchaseTransition = new wasm.TokenSetPriceForDirectPurchaseTransitionWASM(
        baseTransition,
        price,
        'bbbb'
      )

      setPriceDirectPurchaseTransition.price = wasm.TokenPricingScheduleWASM.SetPrices({ 101: 1010 })
      setPriceDirectPurchaseTransition.publicNote = 'aaaa'

      assert.equal(setPriceDirectPurchaseTransition.base.constructor.name, 'TokenBaseTransitionWASM')
      assert.equal(setPriceDirectPurchaseTransition.price.constructor.name, 'TokenPricingScheduleWASM')
      assert.equal(setPriceDirectPurchaseTransition.publicNote, 'aaaa')
    })
  })
})
