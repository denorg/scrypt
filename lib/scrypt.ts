import { encodeBase64 } from "std/encoding/base64.ts";
import { encodeHex } from "std/encoding/hex.ts";
import { instantiate, scrypt_hash } from "./_wasm/scrypt_wasm.generated.js";
const encoder: TextEncoder = new TextEncoder();
const decoder: TextDecoder = new TextDecoder("utf-8");
instantiate();
export type encoding = "utf-8" | "base64" | "hex";
/**
 * Scrypt implementation using web assembly
 * @param {string|Uint8Array} password - string to hash
 * @param {string|Uint8Array} salt -
 * @param {number} N - CPU/Memory cost parameter. Must be a power of 2 smaller than 2^(128*r/8)
 * @param {number} r - block size
 * @param {number} p - parallelism factor
 * @param {number} [dklen] - length (in bytes) of the output. Defaults to 32.
 * @param {encoding} [outputEncoding] - encoding used, defaults to null (Uint8Array)
 * @returns {string|Uint8Array} - the resulting hash encoded according to outputEncoding
 */
export function scrypt(
  password: string | Uint8Array,
  salt: string | Uint8Array,
  N: number,
  r: number,
  p: number,
  dklen?: number,
  outputEncoding?: encoding,
): Uint8Array | string {
  dklen = dklen ?? 64;
  password = typeof password === "string" ? encoder.encode(password) : password;
  salt = typeof salt === "string" ? encoder.encode(salt) : salt;
  const result: Uint8Array = scrypt_hash(password, salt, N, r, p, dklen);
  switch (outputEncoding) {
    case "base64":
      return encodeBase64(result);
    case "hex":
      return encodeHex(result);
    case "utf-8":
      return decoder.decode(result);
    default:
      return result;
  }
}
