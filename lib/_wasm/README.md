# scrypt-wasm

Scrypt crypto library in Web Assembly

# Prerequisities

- This project requires Rust 1.30.0 or later.
- `wasm-pack` is required.
    ```sh
    cargo install wasm-pack
    ```
### Build

```sh
deno run --allow-read --allow-write --allow-run ./build.ts
```

### acknowledgement

This implementation is a modified version of [this repository](https://github.com/MyEtherWallet/scrypt-wasm/)