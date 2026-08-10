import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/sleep", () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));

import { withRetry } from "@/utils/retry";
import { sleep } from "@/utils/sleep";

describe("withRetry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retries after an error and resolves", async () => {
    const error = new Error("temporary error");
    const fn = vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce("ok");

    const result = await withRetry(fn, {
      maxAttempts: 3,
      delay: 10,
    });

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenNthCalledWith(1, 10);
  });

  it("throws immediately when shouldRetryError returns false", async () => {
    const error = new Error("fatal error");
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(fn, {
        maxAttempts: 3,
        shouldRetryError: () => false,
      }),
    ).rejects.toThrow(error);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledTimes(0);
  });

  it("retries while shouldRetryResult returns true", async () => {
    const fn = vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("ready");

    const result = await withRetry(fn, {
      maxAttempts: 5,
      delay: 20,
      shouldRetryResult: (res) => res == null,
    });

    expect(result).toBe("ready");
    expect(fn).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenNthCalledWith(1, 20);
    expect(sleep).toHaveBeenNthCalledWith(2, 20);
  });

  it("returns immediately when shouldRetryResult returns false", async () => {
    const fn = vi.fn().mockResolvedValue("done");

    const result = await withRetry(fn, {
      shouldRetryResult: () => false,
    });

    expect(result).toBe("done");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledTimes(0);
  });

  it("throws the last error after reaching maxAttempts", async () => {
    const error = new Error("always fails");
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(fn, {
        maxAttempts: 2,
        delay: 5,
      }),
    ).rejects.toThrow(error);

    expect(fn).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenNthCalledWith(1, 5);
    expect(sleep).toHaveBeenNthCalledWith(2, 5);
  });

  it("returns last result at maxAttempts even when retry condition stays true", async () => {
    const fn = vi.fn().mockResolvedValue("pending");

    const result = await withRetry(fn, {
      maxAttempts: 2,
      delay: 7,
      shouldRetryResult: () => true,
    });

    expect(result).toBe("pending");
    expect(fn).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenNthCalledWith(1, 7);
    expect(sleep).toHaveBeenNthCalledWith(2, 7);
  });
});
