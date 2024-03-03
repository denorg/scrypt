// deno-lint-ignore-file
// deno-fmt-ignore-file

export interface InstantiateResult {
  instance: WebAssembly.Instance;
  exports: {
    scrypt_hash: typeof scrypt_hash
  };
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated(): boolean;


/** Instantiates an instance of the Wasm module returning its functions.
* @remarks It is safe to call this multiple times and once successfully
* loaded it will always return a reference to the same object. */
export function instantiate(): InstantiateResult["exports"];

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object. */
export function instantiateWithInstance(): InstantiateResult;

/**
* @param {Uint8Array} password
* @param {Uint8Array} salt
* @param {number} n
* @param {number} r
* @param {number} p
* @param {number} dklen
* @returns {Uint8Array}
*/
export function scrypt_hash(password: Uint8Array, salt: Uint8Array, n: number, r: number, p: number, dklen: number): Uint8Array;
