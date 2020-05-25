import { assertEquals, assertMatch } from "https://deno.land/std/testing/asserts.ts";
import { hash, verify } from "./mod.ts";

Deno.test("test basic hashing", async (): Promise<void> => {
  const hashedPassword = await hash("test-password");
  assertEquals(await verify("test-password", hashedPassword), true);
});
/*
Deno.test("test verify", async (): Promise<void> => {
  assertEquals(await verify("test-password2", ""), true);
});*/