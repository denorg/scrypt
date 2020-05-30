import {
  assertEquals,
  assert,
} from "https://deno.land/std/testing/asserts.ts";
import { hash, verify } from "./mod.ts";

Deno.test("basic hashing - scrypt format", async (): Promise<void> => {
  const hashedPassword = await hash("test-password");
  assert(await verify("test-password", hashedPassword));
});
Deno.test("basic hashing - PHC format", async (): Promise<void> => {
  const hashedPassword = await hash("test-password", undefined, "phc");
  assert(await verify("test-password", hashedPassword));
});

Deno.test("basic hashing raw", async (): Promise<void> => {
  const hashedPassword = await hash("test-password", { salt: "test" }, "raw");
  assertEquals(
    hashedPassword,
    "zu8gd0RTeX6r0dbNzBv5ZzXOAQo0UnFUw49uRXrPwAlDocpJSA43WEgAcKNlsBhLyA+zVDluz/0GFa1ShAcr6g==",
  );
});
// source of this test string: https://github.com/barrysteyn/node-scrypt#what-are-the-essential-properties-for-storing-passwords
Deno.test("verify scrypt string", async (): Promise<void> => {
  assert(
    await verify(
      "password1",
      "c2NyeXB0AAwAAAAIAAAAATpP+fdQAryDiRmCmcoOrZa2mZ049KdbA/ofTTrATQQ+m0L/gR811d0WQyip6p2skXVEMz2+8U+xGryFu2p0yzfCxYLUrAaIzaZELkN2M6k0",
    ),
  );
});
// source of this test string: https://passlib.readthedocs.io/en/stable/lib/passlib.hash.scrypt.html
Deno.test("verify PHC string", async (): Promise<void> => {
  assert(
    await verify(
      "password",
      "$scrypt$ln=16,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E",
    ),
  );
});

Deno.test("reject invalid password (PHC)", async (): Promise<void> => {
  assertEquals(
    await verify(
      "invalid-password",
      "$scrypt$ln=16,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E",
    ),
    false,
  );
});

Deno.test("reject invalid password (scrypt)", async (): Promise<void> => {
  assertEquals(
    await verify(
      "invalid-password",
      "c2NyeXB0AAwAAAAIAAAAATpP+fdQAryDiRmCmcoOrZa2mZ049KdbA/ofTTrATQQ+m0L/gR811d0WQyip6p2skXVEMz2+8U+xGryFu2p0yzfCxYLUrAaIzaZELkN2M6k0",
    ),
    false,
  );
});
