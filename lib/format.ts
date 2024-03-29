/**
 * @module scrypt/format
 * @author oplik0
 * @description scrypt output formatting related functions
 */
import { crypto } from "../deps.ts";
import { decodeBase64, encodeBase64 } from "../deps.ts";
import { hmacSHA256 } from "./hmac.ts";
// dprint-ignore-next-line
// deno-fmt-ignore
export type logN = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63;
/**
 * Available parameters primarily influencing security (and runtime) of scrypt
 */
export interface ScryptParameters {
  /**
   * log2 of the work factor N. Must be an integer between 1 and 63. Defaults to 17 (N=131072)
   */
  logN?: logN;
  /**
   * Block size. Defaults to 8
   */
  r?: number;
  /**
   * Parralelism factor. Defaults to 1
   */
  p?: number;
  /**
   * custom salt (by default it will be randomly generated)
   */
  salt?: string | Uint8Array;
  /**
   * desired key length (in bytes).
   */
  dklen?: number;
  /**
   * full number of iterations, if you prefer it over logN (this overrides that setting). Must be a power of 2.
   */
  N?: number;
}
/**
 * Available formats for scrypt hashes
 * scrypt - original scrypt format, see (https://github.com/Tarsnap/scrypt/blob/master/FORMAT). This is the default format.
 * phc - PHC format, a stricter subset of Modular Crypt Format created for argon2.
 * raw - raw hash, without any additional data. Can't be used to verify the hash without also passing the parameters used to generate it.
 */
export type scryptFormat = "scrypt" | "phc" | "raw";
/**
 * Format hash using HMAC-based format from node-scrypt
 * based on the original tarsnap scrypt encrypted data format
 * @see https://github.com/barrysteyn/node-scrypt#kdf
 * @see https://github.com/Tarsnap/scrypt/blob/master/FORMAT
 * @param {string} rawHash - Raw scrypt hash in base64 format
 * @param {number} logN - The log2 of the cost factor
 * @param {number} r - Block size
 * @param {number} p - Parallelism factor
 * @param {string|Uint8Array} salt - Salt used
 * @returns {string} - hash in original scrypt format as a base64 string
 */
export function formatScrypt(
  rawHash: string,
  logN: logN,
  r: number,
  p: number,
  salt: string | Uint8Array,
): string {
  const encoder = new TextEncoder();
  const result = new Uint8Array(96);
  const dataview = new DataView(result.buffer);
  // first 6 bytes are the word "scrypt", 7th byte is 0
  result.set([115, 99, 114, 121, 112, 116, 0], 0);
  dataview.setUint8(7, logN);
  dataview.setUint32(8, r, false);
  dataview.setUint32(12, p, false);
  result.set(typeof salt === "string" ? encoder.encode(salt) : salt, 16);
  const hashedResult = crypto.subtle.digestSync(
    "SHA-256",
    result.subarray(0, 48),
  );
  result.set(new Uint8Array(hashedResult), 48);
  result.set(
    hmacSHA256(
      new Uint8Array(decodeBase64(rawHash)).subarray(32),
      result.subarray(0, 64),
    ),
    64,
  );
  // encode the result as a base64 string
  return encodeBase64(result);
}
/**
 * Retrieve scrypt parameters from an scrypt formatted hash
 * @param {string} formattedHash - scrypt formatted hash
 * @returns {ScryptParameters} - scrypt parameters used to generate the hash
 */
function decomposeScrypt(
  formattedHash: string,
): ScryptParameters {
  const bytes: Uint8Array = new Uint8Array(decodeBase64(formattedHash));
  const dataview: DataView = new DataView(bytes.buffer);
  const parameters: ScryptParameters = {};
  parameters.logN = bytes[7] as logN;
  parameters.r = dataview.getUint32(8, false);
  parameters.p = dataview.getUint32(12, false);
  parameters.salt = bytes.subarray(16, 48);
  return parameters;
}

/**
 * Format hash as a PHC format string (a stricter subset of Modular Crypt Format created for argon2)
 * This format is fully compatible with MCF and this implementation is based on passlib
 * Salt and hash are saved as base64 encoded strings without padding
 * @param {string} rawHash - base64 formatted hash
 * @param {logN} logN - log2 of cost factor
 * @param {number} r - block size
 * @param {number} p - parallelism factor
 * @param {string|Uint8Array} salt - salt used when hashing
 */
export function formatPHC(
  rawHash: string,
  logN: logN,
  r: number,
  p: number,
  salt: string | Uint8Array,
): string {
  // convert salt to base64 without padding
  salt = encodeBase64(salt).replace(/=/g, "");
  rawHash = rawHash.replace(/=/g, "");
  return `\$scrypt\$ln=${logN},r=${r},p=${p}\$${salt}\$${rawHash}`;
}
function decomposePHC(formattedHash: string): ScryptParameters {
  const regex =
    /\$scrypt\$ln=(?<logN>\d+),r=(?<r>\d+),p=(?<p>\d+)\$(?<salt>[a-zA-Z0-9\-\_\+\/\=]*)\$/;
  const parameters: ScryptParameters = formattedHash.match(regex)
    ?.groups as ScryptParameters;
  parameters.salt = new Uint8Array(decodeBase64(parameters.salt as string));
  // the PHC format from passlib always uses 32 bytes hashes
  parameters.dklen = 32;
  return parameters;
}

/**
 * Retrieve scrypt parameters from a supported formatted hash
 * @param {string} formattedHash - formatted hash
 * @param {scryptFormat} format - format of the hash. Will be detected automatically if not provided
 * @returns
 */
export function decomposeFormat(
  formattedHash: string,
  format?: scryptFormat,
): ScryptParameters {
  format = format ?? detectFormat(formattedHash);
  switch (format) {
    case "scrypt":
      return decomposeScrypt(formattedHash);
    case "phc":
      return decomposePHC(formattedHash);
    case "raw":
      throw new Error("Unable to extract parameters from raw hash");
    default:
      throw new Error("Unknown hash format");
  }
}

/**
 * Guess the format of a hash based on its prefix
 * It's technically possible for the raw hash to start with a colliding prefix, but it's very unlikely
 * @param {string} formattedHash - formatted hash to check the format of
 * @returns {scryptFormat} - detected format of the hash
 */
export function detectFormat(
  formattedHash: string,
): scryptFormat {
  switch (formattedHash.substring(0, 6)) {
    case "c2NyeX":
    case "scrypt":
      return "scrypt";
    case "$scryp":
      return "phc";
    default:
      return "raw";
  }
}
