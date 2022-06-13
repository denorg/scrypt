/**
 * @todo document this module
 */
import { decode, encode } from "https://deno.land/std@0.143.0/encoding/base64.ts";
import { HmacSha256, Sha256 } from "https://deno.land/std@0.143.0/hash/sha256.ts";
// deno-fmt-ignore
export type logN =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63;
export interface ScryptParameters {
  logN?: logN;
  r?: number;
  p?: number;
  salt?: string | Uint8Array;
  dklen?: number;
  N?: number;
}
export type scryptFormat = "scrypt" | "phc" | "raw";

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
  const sha256 = new Sha256();
  const hmac = new HmacSha256(new Uint8Array(decode(rawHash)).subarray(32));
  // first 6 bytes are the word "scrypt", 7th byte is 0
  result.set([115, 99, 114, 121, 112, 116, 0], 0);
  dataview.setUint8(7, logN);
  dataview.setUint32(8, r, false);
  dataview.setUint32(12, p, false);
  result.set(typeof salt === "string" ? encoder.encode(salt) : salt, 16);
  sha256.update(result.subarray(0, 48));
  result.set(new Uint8Array(sha256.arrayBuffer()), 48);
  hmac.update(result.subarray(0, 64));
  result.set(
    hmac.array(),
    64,
  );
  // encode the result as a base64 string
  return encode(result);
}
function decomposeScrypt(
  formattedHash: string,
): ScryptParameters {
  const bytes: Uint8Array = new Uint8Array(decode(formattedHash));
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
  salt = encode(salt).replace(/=/g, "");
  rawHash = rawHash.replace(/=/g, "");
  return `\$scrypt\$ln=${logN},r=${r},p=${p}\$${salt}\$${rawHash}`;
}
function decomposePHC(formattedHash: string): ScryptParameters {
  const regex = /\$scrypt\$ln=(?<logN>\d+),r=(?<r>\d+),p=(?<p>\d+)\$(?<salt>[a-zA-Z0-9\-\_\+\/\=]*)\$/;
  const parameters: ScryptParameters = formattedHash.match(regex)
    ?.groups as ScryptParameters;
  parameters.salt = new Uint8Array(decode(parameters.salt as string));
  // the PHC format from passlib always uses 32 bytes hashes
  parameters.dklen = 32;
  return parameters;
}

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

export function to32bytes(input: string | Uint8Array): Uint8Array {
  if (typeof input === "string") {
    const encoder = new TextEncoder();
    input = encoder.encode(input);
  }
  if (input.byteLength === 32) {
    return input;
  }
  const output = new Uint8Array(32);
  output.set(input);
  return output;
}
