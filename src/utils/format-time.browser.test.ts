import { describe, expect, it, vi } from "vitest";
import { formatTime } from "@/utils/format-time";

const { spyDateTimeFormatResolvedOptions } = vi.hoisted(() => {
  const spyDateTimeFormatResolvedOptions = vi
    .spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions")
    .mockReturnValue({
      locale: "ja",
      calendar: "gregory",
      numberingSystem: "latn",
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  return {
    spyDateTimeFormatResolvedOptions,
  };
});

describe("formatTime()", () => {
  it("formatTime()", () => {
    const formattedTime = formatTime(
      new Date("2025-01-01T12:34:56.789+09:00"),
    );
    expect(formattedTime).toBe("12:34:56.789");
    expect(spyDateTimeFormatResolvedOptions).toHaveBeenCalledTimes(1);
  });
});
