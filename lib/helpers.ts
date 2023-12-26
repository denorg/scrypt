/**
 * @author oplik0
 * @description Small helper functions that don't fit anywhere else
 */

/**
 * Truncate input to 32 bytes
 * Text will be encoded using UTF-8
 * @param {string|Uint8Array} input - data to truncate
 * @returns {Uint8Array} - truncated data
 */
export function to32bytes(input: string | Uint8Array): Uint8Array {
  if (typeof input === "string") {
    const encoder = new TextEncoder();
    input = encoder.encode(input);
  }
  if (input.byteLength === 32) {
    return input;
  }
  return input.subarray(0, 32);
}
