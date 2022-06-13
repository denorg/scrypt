import { assert, assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts ";
import { hash, verify } from "./mod.ts";

Deno.test("basic hashing - scrypt format", (): void => {
  const hashedPassword = hash("test-password");
  assert(verify("test-password", hashedPassword));
});
Deno.test("basic hashing - PHC format", (): void => {
  const hashedPassword = hash("test-password", undefined, "phc");
  assert(verify("test-password", hashedPassword));
});

Deno.test("basic hashing raw", (): void => {
  const hashedPassword = hash("test-password", { salt: "test" }, "raw");
  assertEquals(
    hashedPassword,
    "zu8gd0RTeX6r0dbNzBv5ZzXOAQo0UnFUw49uRXrPwAlDocpJSA43WEgAcKNlsBhLyA+zVDluz/0GFa1ShAcr6g==",
  );
});
// source of this test string: https://github.com/barrysteyn/node-scrypt#what-are-the-essential-properties-for-storing-passwords
Deno.test("verify scrypt string", (): void => {
  assert(
    verify(
      "password1",
      "c2NyeXB0AAwAAAAIAAAAATpP+fdQAryDiRmCmcoOrZa2mZ049KdbA/ofTTrATQQ+m0L/gR811d0WQyip6p2skXVEMz2+8U+xGryFu2p0yzfCxYLUrAaIzaZELkN2M6k0",
    ),
  );
});
// source of this test string: https://passlib.readthedocs.io/en/stable/lib/passlib.hash.scrypt.html
Deno.test("verify PHC string", (): void => {
  assert(
    verify(
      "password",
      "$scrypt$ln=16,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E",
    ),
  );
});

Deno.test("reject invalid password (PHC)", (): void => {
  assertEquals(
    verify(
      "invalid-password",
      "$scrypt$ln=16,r=8,p=1$aM15713r3Xsvxbi31lqr1Q$nFNh2CVHVjNldFVKDHDlm4CbdRSCdEBsjjJxD+iCs5E",
    ),
    false,
  );
});

Deno.test("reject invalid password (scrypt)", (): void => {
  assertEquals(
    verify(
      "invalid-password",
      "c2NyeXB0AAwAAAAIAAAAATpP+fdQAryDiRmCmcoOrZa2mZ049KdbA/ofTTrATQQ+m0L/gR811d0WQyip6p2skXVEMz2+8U+xGryFu2p0yzfCxYLUrAaIzaZELkN2M6k0",
    ),
    false,
  );
});
