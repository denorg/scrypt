# 🔑 scrypt

This is a pure typescript (for now - in the future this module will try to switch to wasm) asynchronous implementation of scrypt key derivation function that doesn't require any privileges.

Warning - this implementation is new and slow. For now it might be too slow to use in production, so if you want security and can grant `--allow-read`, `--allow-write`, `--allow-net`, `--allow-plugin` and use `--unstable`, I'd recommend using [argon2](https://deno.land/x/argon2). If you don't need the best password security, [bcrypt](https://deno.land/x/bcrypt) should be faster and secure *enough*. There are performance improvements coming, but for now there are no good wasm scrypt implementations available, so even after this version is optimized it won't be nearly as fast as native implementation until one is created.

[![Deno CI](https://github.com/denorg/scrypt/workflows/Deno%20CI/badge.svg)](https://github.com/denorg/scrypt/actions)
[![GitHub](https://img.shields.io/github/license/denorg/scrypt)](https://github.com/denorg/scrypt/blob/master/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/denorg/scrypt)](https://github.com/denorg/scrypt/graphs/contributors)
[![Scrypt](https://img.shields.io/badge/deno-scrypt-brightgreen)](https://denorg.github.io/scrypt/)
[![Made by Denorg](https://img.shields.io/badge/made%20by-denorg-0082fb)](https://github.com/denorg)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://github.com/denorg/scrypt)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


## ⭐ Getting started

Import the `hash` and/or `verify` functions and use them:

```ts
import { hash, verify } from "https://raw.githubusercontent.com/denorg/scrypt/master/mod.ts";

const hashResult = hash("password");
const verifyResult = verify("password", hashResult);
```

### CLI with [DPX](https://github.com/denorg/dpx)

After [installing DPX](https://github.com/denorg/dpx), you can directly use the CLI using the `dpx` command:

```bash
dpx scrypt hash <password>
dpx scrypt verify <password> <hash>
```

### CLI

Alternatively, you can use it directly from the CLI by using `deno run`:

```bash
deno run https://raw.githubusercontent.com/denorg/scrypt/master/cli.ts hash <password>
deno run https://raw.githubusercontent.com/denorg/scrypt/master/cli.ts verify <password> <hash>
```

You can also install it globally using the following:

```bash
deno install -n scrypt https://raw.githubusercontent.com/denorg/scrypt/master/cli.ts
```

Then, the package is available to run:

```bash
scrypt hash <password>
scrypt verify <password>
```

## 👩‍💻 Development

Run tests:

```bash
deno test
```

## 📄 License

MIT © [Denorg](https://den.org.in)

<p align="center">
  <a href="https://den.org.in">
    <img width="100" alt="" src="https://raw.githubusercontent.com/denorg/denorg/master/logo.svg">
  </a>
</p>
<p align="center">
  <sub>A project by <a href="https://den.org.in">Denorg</a>, the world's first Deno-focused community<br>organization and consulting company. <a href="https://den.org.in">Work with us →</a></sub>
</p>
