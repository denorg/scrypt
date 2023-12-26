/**
 * A very primitive crypto.subtle.digestSync-based HMAC-SHA256 synchronous implementation.
 */
import { crypto } from "std/crypto/mod.ts";

function mergeArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a);
  result.set(b, a.length);
  return result;
}
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
