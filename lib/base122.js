// Original code: https://github.com/kevinAlbs/Base122

// Provides functions for encoding/decoding data to and from base-122.

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
 * Decodes base-122 encoded data back to the original data.
 * @param {Uint8Array|String} rawData - The data to be decoded. This can be a Uint8Array
 * with raw data bytes or a string of bytes (i.e. the type of argument to btoa())
 * @returns {Uint8Array} The data in a regular array representing byte values.
 */
export function decodeBase122 (base122Data) {
  const strData = typeof (base122Data) === 'string' ? base122Data : utf8DataToString(base122Data)
  const decoded = []
  const decodedIndex = 0
  let curByte = 0
  let bitOfByte = 0

  function push7 (byte) {
    byte <<= 1
    // Align this byte to offset for current byte.
    curByte |= (byte >>> bitOfByte)
    bitOfByte += 7
    if (bitOfByte >= 8) {
      decoded.push(curByte)
      bitOfByte -= 8
      // Now, take the remainder, left shift by what has been taken.
      curByte = (byte << (7 - bitOfByte)) & 255
    }
  }

  for (let i = 0; i < strData.length; i++) {
    const c = strData.charCodeAt(i)
    // Check if this is a two-byte character.
    if (c > 127) {
      // Note, the charCodeAt will give the codePoint, thus
      // 0b110xxxxx 0b10yyyyyy will give => xxxxxyyyyyy
      const illegalIndex = (c >>> 8) & 7 // 7 = 0b111.
      // We have to first check if this is a shortened two-byte character, i.e. if it only
      // encodes <= 7 bits.
      if (illegalIndex != kShortened) push7(kIllegals[illegalIndex])
      // Always push the rest.
      push7(c & 127)
    } else {
      // One byte characters can be pushed directly.
      push7(c)
    }
  }
  return new Uint8Array(decoded)
}

/**
 * Converts a sequence of UTF-8 bytes to a string.
 * @param {Uint8Array} data - The UTF-8 data.
 * @returns {String} A string with each character representing a code point.
 */
function utf8DataToString (data) {
  return new TextDecoder().decode(data)
}
