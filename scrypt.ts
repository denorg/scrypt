import { pbkdf2 } from "https://denopkg.com/chiefbiiko/pbkdf2/mod.ts";
const encoder: TextEncoder = new TextEncoder();
export type encoding = ("utf-8" | "base64" | "hex" | null);
/**
 * Scrypt implementation in TypeScript
 * @param {string|Uint8Array} password - string to hash
 * @param {string|Uint8Array} salt - 
 * @param {number} N - CPU/Memory cost parameter. Must be a power of 2 smaller than 2^(128*r/8)
 * @param {number} r - block size
 * @param {number} p - parallelism factor
 * @param {number} [dklen] - length (in bytes) of the output. Defaults to 32.
 * @param {encoding} [outputEncoding] - encoding used, defaults to null (Uint8Array)
 * @returns {Promise<string|Uint8Array>} - the resulting hash encoded according to outputEncoding
 */
export async function scrypt(
  password: (string | Uint8Array),
  salt: (string | Uint8Array),
  N: number,
  r: number,
  p: number,
  dklen?: number,
  outputEncoding?: encoding,
): Promise<(Uint8Array | string)> {
  dklen = dklen ? dklen : 32;
  password = typeof password === "string" ? encoder.encode(password) : password;
  salt = typeof salt === "string" ? encoder.encode(salt) : salt;
  const blockSize: number = 128 * r;
  let hashResult: Uint8Array = pbkdf2(
    "sha256",
    password,
    salt,
    undefined,
    undefined,
    blockSize * p,
    1,
  ) as Uint8Array;
  let blockPromises: Array<Promise<Uint8Array>> = [];
  for (let i: number = 0; i < p; i++) {
    blockPromises.push(
      ROMix(
        hashResult.subarray(i * blockSize, (i + 1) * blockSize),
        N,
        blockSize,
      ),
    );
  }
  const expensiveSalt: Uint8Array = (await Promise.all(blockPromises)).reduce(
    (result: Uint8Array, item: Uint8Array, index: number) => {
      result.set(item, index * blockSize);
      return result;
    },
    new Uint8Array(p * blockSize),
  );
  return pbkdf2(
    "sha256",
    password,
    expensiveSalt,
    undefined,
    outputEncoding ? outputEncoding : undefined,
    dklen,
    1,
  );
}
/**
 * Synchronous Scrypt implementation in TypeScript. 
 * Might be a little faster than the async one, but benchmark results are mostly similar
 * @param {string|Uint8Array} password - string to hash
 * @param {string|Uint8Array} salt - 
 * @param {number} N - CPU/Memory cost parameter. Must be a power of 2 smaller than 2^(128*r/8)
 * @param {number} r - block size
 * @param {number} p - parallelism factor
 * @param {number} [dklen] - length (in bytes) of the output. Defaults to 32.
 * @param {encoding} [outputEncoding] - encoding used, defaults to null (Uint8Array)
 * @returns {Promise<string|Uint8Array>} - the resulting hash encoded according to outputEncoding
 */
export function scryptSync(
  password: (string | Uint8Array),
  salt: (string | Uint8Array),
  N: number,
  r: number,
  p: number,
  dklen?: number,
  outputEncoding?: encoding,
): (Uint8Array | string) {
  dklen = dklen ? dklen : 32;
  password = typeof password === "string" ? encoder.encode(password) : password;
  salt = typeof salt === "string" ? encoder.encode(salt) : salt;
  const blockSize: number = 128 * r;
  let hashResult: Uint8Array = pbkdf2(
    "sha256",
    password,
    salt,
    undefined,
    undefined,
    blockSize * p,
    1,
  ) as Uint8Array;
  let expensiveSalt: Uint8Array = new Uint8Array(p * blockSize);
  for (let i: number = 0; i < p; i++) {
    expensiveSalt.set(
      ROMixSync(
        hashResult.subarray(i * blockSize, (i + 1) * blockSize),
        N,
        blockSize,
      ),
      i * blockSize,
    );
  }
  return pbkdf2(
    "sha256",
    password,
    expensiveSalt,
    undefined,
    outputEncoding ? outputEncoding : undefined,
    dklen,
    1,
  );
}
/**
 * scryptROMix asynchronous implementation based on RFC7914 
 * @param {Uint8Array} block
 * @param {number} iterations - N parameter of scrypt
 * @returns {Promise<Uint8Array>} - ROMixed data 
 */
export async function ROMix(
  block: Uint8Array,
  iterations: number,
  blockSize?: number,
): Promise<Uint8Array> {
  blockSize = blockSize ? blockSize : block.length;
  let V: Uint8Array = new Uint8Array(iterations * blockSize);
  for (let i: number = 0; i < iterations; i++) {
    V.set(block, i * blockSize);
    block = BlockMix(block);
  }
  let j: number;
  for (let i: number = 0; i < iterations; i++) {
    j = (integrify(block) & (iterations - 1)) >>> 0;
    block = BlockMix(
      xor(block, V.subarray(j * blockSize, (j + 1) * blockSize)),
    );
  }
  return block;
}
/**
 * scryptROMix synchronous implementation based on RFC7914 
 * @param {Uint8Array} block
 * @param {number} iterations - N parameter of scrypt
 * @returns {Promise<Uint8Array>} - ROMixed data 
 */
export function ROMixSync(
  block: Uint8Array,
  iterations: number,
  blockSize?: number,
): Uint8Array {
  blockSize = blockSize ? blockSize : block.length;
  let V: Uint8Array = new Uint8Array(iterations * blockSize);
  for (let i: number = 0; i < iterations; i++) {
    V.set(block, i * blockSize);
    block = BlockMix(block);
  }
  let j: number;
  for (let i: number = 0; i < iterations; i++) {
    j = (integrify(block) & (iterations - 1)) >>> 0;
    block = BlockMix(
      xor(block, V.subarray(j * blockSize, (j + 1) * blockSize)),
    );
  }
  return block;
}
/**
 * turn last 64 bytes of input into a little-endian integer
 * @param {Uint8Array} input - Uint8Array that will be "integrified"
 * @returns {number} - the resulting integer
 */
function integrify(input: Uint8Array): number {
  const dataview = new DataView(input.buffer);
  return dataview.getUint32(input.byteLength - 64, true);
}
/**
 * scryptBlockMix implementation based on RFC7914
 * @param {Uint8Array} block
 * @returns {Uint8Array} 
 */
export function BlockMix(block: Uint8Array): Uint8Array {
  const r: number = Math.floor(block.length / 128);
  let X: Uint8Array = block.subarray(block.length - 64);
  let Y: Uint8Array = block.slice();
  let temp: Uint8Array;
  for (let i: number = 0; i < 2 * r; i++) {
    temp = xor(X, block.subarray(i * 64, (i + 1) * 64));
    X = salsa20_8(temp);
    Y.set(X, i % 2 === 0 ? i * 32 : (Math.ceil(i / 2) + r - 1) * 64);
  }
  return Y;
}
/**
 * R function used by salsa20 core implementation in RFC7914
 * @param {number} data
 * @param {number} shift
 * @returns {number}
 */
function R(data: number, shift: number): number {
  //">>>0" is a hack to make js bitwise operations work with unsigned representations of 32 bit ints
  return ((data << shift) | (data >>> (32 - shift)));
}
/**
 * Salsa20/8 core implementation based on RFC7914 and js-salsa20
 * @param {Uint8Array} input
 * @returns {Uint8Array}
 */
export function salsa20_8(input: Uint8Array): Uint8Array {
  //B32 is a Uint32 representation of the buffer provided on input
  let B32 = new Uint32Array(input.buffer);
  let x = B32.slice();
  for (let i: number = 0; i < 8; i += 2) {
    x[4] ^= R(x[0] + x[12], 7);
    x[8] ^= R(x[4] + x[0], 9);
    x[12] ^= R(x[8] + x[4], 13);
    x[0] ^= R(x[12] + x[8], 18);
    x[9] ^= R(x[5] + x[1], 7);
    x[13] ^= R(x[9] + x[5], 9);
    x[1] ^= R(x[13] + x[9], 13);
    x[5] ^= R(x[1] + x[13], 18);
    x[14] ^= R(x[10] + x[6], 7);
    x[2] ^= R(x[14] + x[10], 9);
    x[6] ^= R(x[2] + x[14], 13);
    x[10] ^= R(x[6] + x[2], 18);
    x[3] ^= R(x[15] + x[11], 7);
    x[7] ^= R(x[3] + x[15], 9);
    x[11] ^= R(x[7] + x[3], 13);
    x[15] ^= R(x[11] + x[7], 18);
    x[1] ^= R(x[0] + x[3], 7);
    x[2] ^= R(x[1] + x[0], 9);
    x[3] ^= R(x[2] + x[1], 13);
    x[0] ^= R(x[3] + x[2], 18);
    x[6] ^= R(x[5] + x[4], 7);
    x[7] ^= R(x[6] + x[5], 9);
    x[4] ^= R(x[7] + x[6], 13);
    x[5] ^= R(x[4] + x[7], 18);
    x[11] ^= R(x[10] + x[9], 7);
    x[8] ^= R(x[11] + x[10], 9);
    x[9] ^= R(x[8] + x[11], 13);
    x[10] ^= R(x[9] + x[8], 18);
    x[12] ^= R(x[15] + x[14], 7);
    x[13] ^= R(x[12] + x[15], 9);
    x[14] ^= R(x[13] + x[12], 13);
    x[15] ^= R(x[14] + x[13], 18);
  }
  for (let i: number = 0; i < 16; ++i) {
    B32[i] += x[i];
  }
  return input;
}
/**
 * xor two Uint8Arrays
 * @param {Uint8Array} a - first Uint8Array
 * @param {Uint8Array} b - second Uint8Array
 * @returns {Uint8Array} - xor result
 */
function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
  let buffer = new Uint8Array(a);
  for (let i: number = a.length-1; i >= 0; i--) {
    buffer[i] ^= b[i];
  }
  return buffer;
}
