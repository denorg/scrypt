/**
 * @module scrypt
 * @author oplik0
 * @version 1.0.0
 */

import {
  decomposeFormat,
  detectFormat,
  formatPHC,
  formatScrypt,
  logN,
  scryptFormat,
  ScryptParameters,
  to32bytes,
} from "./lib/helpers.ts";
import { scrypt } from "./lib/scrypt.ts";

/**
 * Hash a password with scrypt. Outputs a string in rscrypt format.
 * @author oplik0
 * @param {string} password - Password that will be hashed
 * @param {ScryptParameters} [parameters] - Scrypt parameters (n, r and p) used for hashing.
 * @param {number} [parameters.logN=14] - log2 of the work factor N. Must be an integer between 1 and 63. Defaults to 14 (N=16384)
 * @param {number} [parameters.r=8] - Block size. Defaults to 16
 * @param {number} [parameters.p=1] - Parralelism factor. Defaults to 1
 * @param {string} [parameters.salt] - custom salt (by default it will be randomly generated)
 * @param {number} [parameters.dklen=64] - desired key length (in bytes)
 * @param {number} [parameters.N=16384] - full number of iterations if you don't like using logN (this overrides that setting). Must be a power of 2.
 * @param {scryptFormat} [format="scrypt"] - format of the result. Defaults to scrypt encrypted data format (https://github.com/Tarsnap/scrypt/blob/master/FORMAT)
 * @returns {string} - Hash in scrypt format
 */
export function hash(
  password: string,
  parameters?: ScryptParameters,
  format?: scryptFormat,
): string {
  format = format ? format : "scrypt";
  parameters = parameters ?? {};
  const N = parameters.N ?? 2 ** (parameters.logN ?? 14);
  const r = parameters.r ?? 8;
  const p = parameters.p ?? 1;
  const salt = parameters.salt
    ? (format === "scrypt" ? to32bytes(parameters.salt) : parameters.salt)
    : genSalt(32, "Uint8Array");
  const dklen = parameters.dklen
    ? parameters.dklen
    : format === "phc"
    ? 32
    : 64;
  const scryptResult = scrypt(password, salt, N, r, p, dklen, "base64") as string;
  switch (format) {
    case "raw":
      return scryptResult;
    case "scrypt":
      return formatScrypt(scryptResult, Math.log2(N) as logN, r, p, salt);
    case "phc":
      return formatPHC(scryptResult, Math.log2(N) as logN, r, p, salt);
    default:
      throw new Error("invalid output format");
  }
}
/**
 * Checks provided string against provided hash
 * @author oplik0
 * @param {string} password - string that will be checked against the hash
 * @param {string} testedHash - hash in a compatible format (scrypt or phc formats supported for now)
 * @param {scryptFormat} [format] - format od the tested hash. Will be detected automatically if not provided
 * @returns {boolean} result of the check
 */
export function verify(
  password: string,
  testedHash: string,
  format?: scryptFormat,
): boolean {
  format = format ?? detectFormat(testedHash);
  const params: ScryptParameters = decomposeFormat(testedHash, format);
  const newHash = hash(password, params, format);
  return newHash === testedHash;
}

/**
 * generate random salt using Deno csprng (crypto.getRandomValues)
 * @author oplik0
 * @param {number} [length=16] - numebr of bytes to generate
 * @param {string} [outputType] - either string or Uint8Array
 * @returns {string|Uint8Array} random salt
 */
export function genSalt(
  length?: number,
  outputType?: "string" | "Uint8Array",
): string | Uint8Array {
  const array = new Uint8Array(length || 32);
  const decoder = new TextDecoder();
  const randomArray = crypto.getRandomValues(array);
  const salt = outputType === "Uint8Array"
    ? randomArray
    : decoder.decode(randomArray);
  return salt;
}
