import { hash, verify } from "https://deno.land/x/scrypt@v4.4.2/mod.ts";

console.time("hash");
const hashResult = hash("password", { logN: 17 });
console.timeEnd("hash");

console.time("verify");
const verifyResult = verify("password", hashResult);
console.timeEnd("verify");