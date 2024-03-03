/**
 * @module scrypt/hmac
 * @author oplik0
 * @description A very primitive crypto.subtle.digestSync-based HMAC-SHA256 synchronous implementation.
 */
import { crypto } from "../deps.ts";

/**
 * Join two arrays at the end of the first one
 * @param {Uint8Array} a - first array
 * @param {Uint8Array} b - second array
 * @returns {Uint8Array} - joined array of length a.length + b.length
 */
function mergeArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a);
  result.set(b, a.length);
  return result;
}
/**
 * Ensure that key is of the correct length
 * @param {Uint8Array} key
 * @param {Uint8Array} blockSize length to get the key to
 * @returns
 */
function blockSizedKey(key: Uint8Array, blockSize: number): Uint8Array {
  if (key.length > blockSize) {
    return new Uint8Array(crypto.subtle.digestSync("SHA-256", key));
  } else if (key.length < blockSize) {
    const result = new Uint8Array(blockSize);
    result.set(key);
    return result;
  }
  return key;
}

/**
 * Synchronous Hash-based Message Authentication Code implementation using SHA256
 * @see https://en.wikipedia.org/wiki/HMAC
 * @param {Uint8Array} key
 * @param {Uint8Array} data
 * @returns {Uint8Array} - HMAC-SHA256 of data using key
 */
export function hmacSHA256(key: Uint8Array, data: Uint8Array): Uint8Array {
  const b_key = blockSizedKey(key, 64);
  const o_pad = new Uint8Array(64);
  const i_pad = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    o_pad[i] = b_key[i] ^ 0x5c;
    i_pad[i] = b_key[i] ^ 0x36;
  }
  return new Uint8Array(crypto.subtle.digestSync(
    "SHA-256",
    mergeArrays(
      o_pad,
      new Uint8Array(
        crypto.subtle.digestSync("SHA-256", mergeArrays(i_pad, data)),
      ),
    ),
  ));
}
