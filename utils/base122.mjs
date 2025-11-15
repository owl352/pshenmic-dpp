// Original code: https://github.com/kevinAlbs/Base122

// Provides functions for encoding/decoding data to and from base-122.

const kString = 0
const kUint8Array = 1
const kDebug = false
const kIllegals = [
  0, // null
  10, // newline
  13, // carriage return
  34, // double quote
  38, // ampersand
  92 // backslash
]
const kShortened = 0b111 // Uses the illegal index to signify the last two-byte char encodes <= 7 bits.

/**
 * Encodes raw data into base-122.
 * @param {Uint8Array|Buffer|Array|String} rawData - The data to be encoded. This can be an array
 * or Buffer with raw data bytes or a string of bytes (i.e. the type of argument to btoa())
 * @returns {Array} The base-122 encoded data as a regular array of UTF-8 character byte values.
 */
export function encode (rawData) {
  const dataType = typeof (rawData) === 'string' ? kString : kUint8Array
  let curIndex = 0
  let curBit = 0 // Points to current bit needed
  const curMask = 0b10000000
  const outData = []
  let getByte = i => rawData[i]

  if (dataType == kString) {
    getByte = (i) => {
      const val = rawData.codePointAt(i)
      if (val > 255) {
        throw 'Unexpected code point at position: ' + i + '. Expected value [0,255]. Got: ' + val
      }
      return val
    }
  }

  // Get seven bits of input data. Returns false if there is no input left.
  function get7 () {
    if (curIndex >= rawData.length) return false
    // Shift, mask, unshift to get first part.
    const firstByte = getByte(curIndex)
    let firstPart = ((0b11111110 >>> curBit) & firstByte) << curBit
    // Align it to a seven bit chunk.
    firstPart >>= 1
    // Check if we need to go to the next byte for more bits.
    curBit += 7
    if (curBit < 8) return firstPart // Do not need next byte.
    curBit -= 8
    curIndex++
    // Now we want bits [0..curBit] of the next byte if it exists.
    if (curIndex >= rawData.length) return firstPart
    const secondByte = getByte(curIndex)
    let secondPart = ((0xFF00 >>> curBit) & secondByte) & 0xFF
    // Align it.
    secondPart >>= 8 - curBit
    return firstPart | secondPart
  }

  while (true) {
    // Grab 7 bits.
    const bits = get7()
    if (bits === false) break
    debugLog('Seven input bits', print7Bits(bits), bits)

    const illegalIndex = kIllegals.indexOf(bits)
    if (illegalIndex != -1) {
      // Since this will be a two-byte character, get the next chunk of seven bits.
      let nextBits = get7()
      debugLog('Handle illegal sequence', print7Bits(bits), print7Bits(nextBits))

      let b1 = 0b11000010; let b2 = 0b10000000
      if (nextBits === false) {
        debugLog('Last seven bits are an illegal sequence.')
        b1 |= (0b111 & kShortened) << 2
        nextBits = bits // Encode these bits after the shortened signifier.
      } else {
        b1 |= (0b111 & illegalIndex) << 2
      }

      // Push first bit onto first byte, remaining 6 onto second.
      const firstBit = (nextBits & 0b01000000) > 0 ? 1 : 0
      b1 |= firstBit
      b2 |= nextBits & 0b00111111
      outData.push(b1)
      outData.push(b2)
    } else {
      outData.push(bits)
    }
  }
  return outData
}

// For debugging.
function debugLog () {
  if (kDebug) console.log(...arguments)
}

// For debugging.
function print7Bits (num) {
  return '0000000'.substring(num.toString(2).length) + num.toString(2)
}
