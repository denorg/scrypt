/**
 * Just a few simple benchmarks
 * @todo document the benchmarks better
 */
import {
    runBenchmarks,
    bench,
} from "https://deno.land/std@0.110.0/testing/bench.ts";
import { scrypt } from "./scrypt.ts";
const extremeSalt: string = `IkjpewCbNm4A7cuY1VL9KC3y92blEthtLf9Cet6uEoTxz5cyF660da2zeci42fYwVCVwsKogETMCXupSZZAUh6a80ZnnBTk17B3UTCSVQPpYfL8GktJ2BDokE7ox2hV8OwwUT1hFvCuJqwHZpRvZw1RNCO6HfukPdgMHhq9rWLTXXUNwrIjlmkeydKGFJz2mS1xFcvLQtle4olJVK0SXXXYHAigBfpYxxSC2acvoxuacWcXhzSSRZAMysU2J7zDfXdxnYoqz50rvmvi36g7t2WDSAdzZ44JpxVcc3bYD7xYI3UgfVMPOfeblzwJi455QIurHzDuXEUNS0tZX1kWwZ0XcNSCwGzPs7WSVHxHc0KVUNhwSz16wDYFK4pYeA29ThXgFiFICSLVshiRrCfuzRthW7IZtRa9efcf4nFJsVBk51jpHY0b8CLhARrQU92mlBULwmJKe8DgST3Vn9rva98E9jk4y7NfSb4i9g74OjuFQ8yRO3BHksBZoVtBl4wUppM2hsLt72LZKA0ZsaWW7dG9a1bgWUkBBRG5OwzARenDqQIA2Gp5V4JsXuUUYNDylCelkLUVfS7hB1AZHtnIgwVqTaGDxl7nNZGKpAx6MrOd40laTUhrtZo4prwFZROHPNVJGQk2PQDgwqxX5SWoBTK8cCCzrbGBfHq9r8BwBvSVdeQ7bgjUW2j7NCapHHZ6filzxZaVsLsEITGZNcK0t5DdSnaDLRxyOn21ncKVIyZfOdlvpytvqpQaH5RWu4G50IPkEevue8KenXpGLP0pmEseBf6eX02rlN9arqZ4HJWmD7RbAChs7OJwfKlNIawb0V3G3N0eJeXiRsYOk10GIb91pyZRLSr2AJDtiWCcMuOWZfgLVHIrUVftfh9iXmRk2RAT1sigivbNtdqcF2cVvbTVMUCe7MIPRt4dGqwOQqdReGjPy9p1CNfKfJBIgW0xhYsOGMkcUqSurHxPl4wTOnMBx8vEZQsqJCZomENA1`;
const extremePassword: string = `TFImeWrtF2kOIvDjG4P0ybmMrNOq0bQ0aERcC69iHflECWrwuSMO4JPD3Ng5HwNXZrCpHyEwviW8zly3WLsQ6zJ60lnfwhVRdkEQCsFiH4NvGl0tCAuty9Rruf47WHeE3GK7qAJwhcXHx3FCJgWN8KHdoy3vn2zUKJlhhjSFGANJdVYQGSaQTmtoJdhcemmYT5hprkALp7Q9vMwCk9hDvV5vB0evXfxqG0dFV3MPJmywwWAUJEi5MyM2Pio7fL50M5ohPWFmUllpa6G5pVBhi26GtOy6sM3GDGHmnohavtsMvTeRcMX1ds4HWA9U3vH7urQ3XGkCUzulB6WxuxHn8Z3fRz3BL6MZI0EReep2qUVaqJn8onzsI6da6pU6iDtRbufWxi0q8XN1S3BCtFGjzaTU12nvfg5js53PiSw1KUnZj2thKxWtnKcpwzbXdTuuZ9GVhZHIMcOXXrDR0rj539ZLAVyJmqwDOMjTsqPN7BY522PcJHoTElSRNRAsAsFx2m7h9brhcZXOgV1PZohJsdQS7RWhAl9EYBkgF8WCgGw9DXidVduIIHDlEd7mAVJfo9HYX85kFcwrLEpuPiFxfNhubeDpeBu2FAbAo6DNHFlqXUUnyKvMbzptcgisSr2V1pwykB6uLVrwx3AceRnyqg5flldmfsSKw0AFZ4PagGMJuFDMGrV29Vmqhv61SRL9in0ngZx0gJ2vKv26qS3jGN72UUsbkysuGNz6ul0D5jIapvIcCTncIiXSY24pPctxFsawcXvSNw4jEKccsHCTZF0gri6iFS7JqqQd87FNowbrug6sIWSwiWHYGN1VfSwuE5plQHVvNCHNZnMBBIoaMWh45lhtlfCWdUwVpjjK5dAUcOtKftJ2hcl4mIlxs7Fy8ASWhYvWAbpp3fRgmAeTRYAFEwMohN9b03iXyDSNFIeZtQoaL7HYFVWoXV4BfBVlR3CvNIwp6OPBAFFSDlSn9CZU06UziY1tSwqBzkCD`;

bench({
    name: "small scrypt",
    runs: 10,
    async func(b): Promise<void> {
        b.start();
        await scrypt("password", "salt", 1024, 8, 1, 64);
        b.stop();
    },
});
bench({
    name: "small scrypt (longer password)",
    runs: 10,
    async func(b): Promise<void> {
        b.start();
        await scrypt("long password to test that", "salt", 1024, 8, 1, 64);
        b.stop();
    },
});
bench({
    name: "small scrypt (longer salt)",
    runs: 100,
    async func(b): Promise<void> {
        b.start();
        await scrypt("password", "long salt to test that", 1024, 8, 1, 64);
        b.stop();
    },
});
bench({
    name: "small scrypt (longer password and salt)",
    runs: 100,
    async func(b): Promise<void> {
        b.start();
        await scrypt(
            "long password to test that",
            "long salt to test that",
            1024,
            8,
            1,
            64
        );
        b.stop();
    },
});

bench({
    name: "small scrypt (extremely long salt)",
    runs: 100,
    async func(b): Promise<void> {
        b.start();
        await scrypt("password", extremeSalt, 1024, 8, 1, 64);
        b.stop();
    },
});

bench({
    name: "small scrypt (extremely long password)",
    runs: 100,
    async func(b): Promise<void> {
        b.start();
        await scrypt(extremePassword, "NaCl", 1024, 8, 1, 64);
        b.stop();
    },
});

bench({
    name: "small scrypt (extremely long password and salt)",
    runs: 100,
    async func(b): Promise<void> {
        b.start();
        await scrypt(extremePassword, extremeSalt, 1024, 8, 1, 64);
        b.stop();
    },
});

bench({
    name: "standard scrypt",
    runs: 20,
    async func(b): Promise<void> {
        b.start();
        await scrypt("password", "NaCl", 16384, 8, 1, 64);
        b.stop();
    },
});

runBenchmarks();
