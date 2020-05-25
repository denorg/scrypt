/**
 * @module scrypt
 * @author oplik0
 * @version 1.0.0
 */

import { scrypt } from "./scrypt.ts";

export interface ScryptParameters {
  N?: number,
  r?: number,
  p?: number,
  salt?: string,
  dklen?:number
}
export type scryptFormat = ("scrypt"|"raw")
/**
 * Hash a password with scrypt. Outputs a string in rscrypt format.
 * @author oplik0
 * @param {string} password - Password that will be hashed
 * @param {ScryptParameters} [parameters] - Scrypt parameters (n, r and p) used for hashing. 
 * @param {number} [parameters.N=16384] - Work factor. Should be a power of 2. Defaults to 32768
 * @param {number} [parameters.r=8] - Block size. Defaults to 16
 * @param {number} [parameters.p=1] - Parralelism factor. Defaults to 1
 * @param {string} [parameters.salt] - custom salt (by default it will be randomly generated)
 * @param {number} [parameters.dklen=32] - desired key length (in bytes)
 * @param {scryptFormat} [format="scrypt"] - format of the result. Defaults to scrypt encrypted data format (https://github.com/Tarsnap/scrypt/blob/master/FORMAT) 
 * @returns {string} - Hash in scrypt format
 * @todo Add option to generate standard scrypt format
 */
export async function hash(password: string, parameters?: ScryptParameters, format?: scryptFormat): Promise<string> {
  format = format ? format : "scrypt";
  parameters = parameters || {};
  const N = parameters.N || 16384;
  const r = parameters.r || 8;
  const p = parameters.p || 1;
  const salt = parameters.salt ? parameters.salt : await genSalt();
  const dklen = parameters.dklen ? parameters.dklen : 32;
  let scryptResult: string  = (await scrypt(password, salt, N, r, p, dklen, "base64")) as string;
  switch (format){
    case "raw":
      return scryptResult;
    case "scrypt":
      return await formatScrypt(scryptResult, N, r, p, salt);
  }
}
/**
 * Checks provided string against provided hash
 * @author oplik0
 * @param {string} password - string that will be checked against the hash 
 * @param {string} hash - hash in rscrypt format
 * @returns {boolean} result of the check
 * @todo Handle more standard scrypt format instead of just rscrypt
 */
export async function verify(password: string, hash: string): Promise<boolean> {
  return false;
}

/**
 * generate random salt using Deno csprng (crypto.getRandomValues)
 * @author oplik0
 * @param {number} [length=32] - numebr of bytes to generate
 * @returns {string} Hex-encoded salt
 */
export async function genSalt(length?: number): Promise<string> {
  const array = new Uint8Array(length||32);
  const randomArray = crypto.getRandomValues(array);
  const salt = [...randomArray].map(byte=>byte.toString(16).padStart(2, "0")).join("");
  return salt;
}

export async function formatScrypt(hash:string, N:number, r:number, p:number, salt:string): Promise<string> {
  return ""
}