import { describe, expect, it, vi } from "vitest";
import { sleep } from "@/utils";

describe("sleep", () => {
  it("waits ms", async () => {
    const spy = vi.fn();
    const start = performance.now();
    await sleep(200).then(spy);
    const end = performance.now();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(end - start).toSatisfy((duration) => duration >= 200);
  });
});
