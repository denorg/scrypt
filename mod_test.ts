import { assertEquals, assertMatch } from "https://deno.land/std/testing/asserts.ts";
import { hash, hashCustom, verify, genSalt } from "./mod.ts";

Deno.test("test basic hashing", async (): Promise<void> => {
  const hashedPassword = await hash("test-password");
  assertMatch(hashedPassword, /^\$rscrypt\$/);
  assertEquals(await verify("test-password", hashedPassword), true);
});

Deno.test("test verify", async (): Promise<void> => {
  assertEquals(await verify("test-password2", ""), true);
});

Deno.test("test hashCustom", async (): Promise<void> => {
  assertEquals(await hashCustom("test-password3", {N: 32768, r: 16, p: 1}, "test-salt", 64), "zå¬:¥..Á;;pm.....Ë5¬AÏ.\ë,Lð(%®|.ä¿1.¬.R©.£±Ûj³]..ÿbò.ÛÖ..¹ÜQ.VD");
});