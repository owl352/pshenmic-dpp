/**
 * Decodes base-122 encoded data back to the original data.
 * @param {Uint8Array|String} rawData - The data to be decoded. This can be a Uint8Array
 * with raw data bytes or a string of bytes (i.e. the type of argument to btoa())
 * @returns {Uint8Array} The data in a regular array representing byte values.
 */
export function decode(base122Data: any): Uint8Array;
