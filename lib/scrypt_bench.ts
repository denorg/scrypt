/**
 * Just a few simple benchmarks
 * @todo document the benchmarks better
 */
import { scrypt as scryptOld } from "https://deno.land/x/scrypt@v4.4.4/lib/scrypt.ts";
import { scrypt } from "./scrypt.ts";
import { scrypt as scryptNodeRaw } from "node:crypto";
import { scrypt as scryptoRaw } from "https://deno.land/x/scrypto@v1.0.0/main.ts";
import { scrypt as scryptWasmRaw } from "npm:hash-wasm"
import { scrypt as scryptNobleRaw } from "npm:@noble/hashes/scrypt"

function scryptNode(
  password: string,
  salt: string,
  N: number,
  r: number,
  p: number,
  dklen: number = 64,
) {
  return new Promise((resolve) =>
    scryptNodeRaw(password, salt, dklen, { N, r, p }, resolve)
  );
}

function scrypto(
  password: string,
  salt: string,
  N: number,
  r: number,
  p: number,
  dkLen: number = 64,
) {
  return scryptoRaw(password, salt, { N, r, p, dkLen})
}

function scryptWasm (
  password: string,
  salt: string,
  N: number,
  r: number,
  p: number,
  dkLen: number = 64,
) {
  return scryptWasmRaw({password, salt, costFactor: N, blockSize: r, parallelism: p, hashLength: dkLen});
}

function scryptNoble (
  password: string,
  salt: string,
  N: number,
  r: number,
  p: number,
  dkLen: number = 64,
) {
  return scryptNobleRaw(password, salt, {N, r, p, dkLen});
}

const scryptImplementations = {
  "current": scrypt,
  "last version": scryptOld,
  "hash-wasm": scryptWasm,
  "noble-hashes": scryptNoble,
  "node": scryptNode,
  // "scrypto": scrypto, // disabled because it's 5x slower, so the data isn't very useful and the benchmark takes unnecessarily long
};

const extremeSalt =
  `IkjpewCbNm4A7cuY1VL9KC3y92blEthtLf9Cet6uEoTxz5cyF660da2zeci42fYwVCVwsKogETMCXupSZZAUh6a80ZnnBTk17B3UTCSVQPpYfL8GktJ2BDokE7ox2hV8OwwUT1hFvCuJqwHZpRvZw1RNCO6HfukPdgMHhq9rWLTXXUNwrIjlmkeydKGFJz2mS1xFcvLQtle4olJVK0SXXXYHAigBfpYxxSC2acvoxuacWcXhzSSRZAMysU2J7zDfXdxnYoqz50rvmvi36g7t2WDSAdzZ44JpxVcc3bYD7xYI3UgfVMPOfeblzwJi455QIurHzDuXEUNS0tZX1kWwZ0XcNSCwGzPs7WSVHxHc0KVUNhwSz16wDYFK4pYeA29ThXgFiFICSLVshiRrCfuzRthW7IZtRa9efcf4nFJsVBk51jpHY0b8CLhARrQU92mlBULwmJKe8DgST3Vn9rva98E9jk4y7NfSb4i9g74OjuFQ8yRO3BHksBZoVtBl4wUppM2hsLt72LZKA0ZsaWW7dG9a1bgWUkBBRG5OwzARenDqQIA2Gp5V4JsXuUUYNDylCelkLUVfS7hB1AZHtnIgwVqTaGDxl7nNZGKpAx6MrOd40laTUhrtZo4prwFZROHPNVJGQk2PQDgwqxX5SWoBTK8cCCzrbGBfHq9r8BwBvSVdeQ7bgjUW2j7NCapHHZ6filzxZaVsLsEITGZNcK0t5DdSnaDLRxyOn21ncKVIyZfOdlvpytvqpQaH5RWu4G50IPkEevue8KenXpGLP0pmEseBf6eX02rlN9arqZ4HJWmD7RbAChs7OJwfKlNIawb0V3G3N0eJeXiRsYOk10GIb91pyZRLSr2AJDtiWCcMuOWZfgLVHIrUVftfh9iXmRk2RAT1sigivbNtdqcF2cVvbTVMUCe7MIPRt4dGqwOQqdReGjPy9p1CNfKfJBIgW0xhYsOGMkcUqSurHxPl4wTOnMBx8vEZQsqJCZomENA1`;
const extremePassword =
  `TFImeWrtF2kOIvDjG4P0ybmMrNOq0bQ0aERcC69iHflECWrwuSMO4JPD3Ng5HwNXZrCpHyEwviW8zly3WLsQ6zJ60lnfwhVRdkEQCsFiH4NvGl0tCAuty9Rruf47WHeE3GK7qAJwhcXHx3FCJgWN8KHdoy3vn2zUKJlhhjSFGANJdVYQGSaQTmtoJdhcemmYT5hprkALp7Q9vMwCk9hDvV5vB0evXfxqG0dFV3MPJmywwWAUJEi5MyM2Pio7fL50M5ohPWFmUllpa6G5pVBhi26GtOy6sM3GDGHmnohavtsMvTeRcMX1ds4HWA9U3vH7urQ3XGkCUzulB6WxuxHn8Z3fRz3BL6MZI0EReep2qUVaqJn8onzsI6da6pU6iDtRbufWxi0q8XN1S3BCtFGjzaTU12nvfg5js53PiSw1KUnZj2thKxWtnKcpwzbXdTuuZ9GVhZHIMcOXXrDR0rj539ZLAVyJmqwDOMjTsqPN7BY522PcJHoTElSRNRAsAsFx2m7h9brhcZXOgV1PZohJsdQS7RWhAl9EYBkgF8WCgGw9DXidVduIIHDlEd7mAVJfo9HYX85kFcwrLEpuPiFxfNhubeDpeBu2FAbAo6DNHFlqXUUnyKvMbzptcgisSr2V1pwykB6uLVrwx3AceRnyqg5flldmfsSKw0AFZ4PagGMJuFDMGrV29Vmqhv61SRL9in0ngZx0gJ2vKv26qS3jGN72UUsbkysuGNz6ul0D5jIapvIcCTncIiXSY24pPctxFsawcXvSNw4jEKccsHCTZF0gri6iFS7JqqQd87FNowbrug6sIWSwiWHYGN1VfSwuE5plQHVvNCHNZnMBBIoaMWh45lhtlfCWdUwVpjjK5dAUcOtKftJ2hcl4mIlxs7Fy8ASWhYvWAbpp3fRgmAeTRYAFEwMohN9b03iXyDSNFIeZtQoaL7HYFVWoXV4BfBVlR3CvNIwp6OPBAFFSDlSn9CZU06UziY1tSwqBzkCD`;

for (const [name, implementation] of Object.entries(scryptImplementations)) {
  Deno.bench(`small scrypt - ${name}`, {
    group: "small scrypt",
    baseline: name === "current",
  }, async () => {
    await implementation("password", "salt", 1024, 8, 1, 64);
  });

  Deno.bench(`small scrypt - ${name} (longer password and salt)`, {
    group: "small scrypt (longer password and salt)",
    baseline: name === "current",
  }, async () => {
    await implementation(
      "long password to test that",
      "long salt to test that",
      1024,
      8,
      1,
      64,
    );
  });

  Deno.bench(`small scrypt - ${name} (extremely long password and salt)`, {
    group: "small scrypt (extremely long password and salt)",
    baseline: name === "current",
  }, async () => {
    await implementation(extremePassword, extremeSalt, 1024, 8, 1, 64);
  });

  Deno.bench(`old standard scrypt (logN=14) - ${name}`, {
    group: "scrypt (logN=14)",
    baseline: name === "current",
  }, async () => {
    await implementation("password", "salt", 16384, 8, 1, 64);
  });

  Deno.bench(`standard scrypt (logN=17) - ${name}`, {
    group: "scrypt",
    baseline: name === "current",
  }, async () => {
    await implementation("password", "salt", 131072, 8, 1, 64);
  });

  Deno.bench(
    `old standard scrypt (logN=14) - ${name} (longer password and salt)`,
    {
      group: "scrypt (logN=14; longer password and salt)",
      baseline: name === "current",
    },
    async () => {
      await implementation(
        "long password to test that",
        "long salt to test that",
        16384,
        8,
        1,
        64,
      );
    },
  );

  Deno.bench(
    `standard scrypt (logN=17) - ${name} (longer password and salt)`,
    {
      group: "scrypt (longer password and salt)",
      baseline: name === "current",
    },
    async () => {
      await implementation(
        "long password to test that",
        "long salt to test that",
        131072,
        8,
        1,
        64,
      );
    },
  );

  Deno.bench(
    `old standard scrypt (logN=14) - ${name} (extremely long password and salt)`,
    {
      group: "scrypt (logN=14; extremely long password and salt)",
      baseline: name === "current",
    },
    async () => {
      await implementation(extremePassword, extremeSalt, 16384, 8, 1, 64);
    },
  );

  Deno.bench(
    `standard scrypt (logN=17) - ${name} (extremely long password and salt)`,
    {
      group: "scrypt (extremely long password and salt)",
      baseline: name === "current",
    },
    async () => {
      await implementation(extremePassword, extremeSalt, 131072, 8, 1, 64);
    },
  );

  Deno.bench(`large n scrypt - ${name} (4x standard)`, {
    group: "large n scrypt",
    baseline: name === "current",
  }, async () => {
    await implementation("password", "salt", 524288, 8, 1, 64);
  });

  Deno.bench(`large r scrypt - ${name} (4x standard)`, {
    group: "large r scrypt",
    baseline: name === "current",
  }, async () => {
    await implementation("password", "salt", 131072, 32, 1, 64);
  });

  Deno.bench(`large p scrypt - ${name} (4x standard)`, {
    group: "large p scrypt",
    baseline: name === "current",
  }, async () => {
    await implementation("password", "salt", 131072, 8, 4, 64);
  });
}
