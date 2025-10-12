import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { sleep } from "@/utils/sleep";

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits ms", async () => {
    const spy = vi.fn();
    const promise = sleep(200).then(spy);
    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(100);
    await promise;
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
