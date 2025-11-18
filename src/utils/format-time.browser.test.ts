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
  it.each([
    {
      dateValue: "2025-01-01T12:34:56.789+09:00",
      formatType: "hh:mm:ss.fff",
      expected: "12:34:56.789",
    },
    {
      dateValue: "2025-12-30T12:34:56.789+09:00",
      formatType: "yyyy/MM/dd HH:mm:ss.fff",
      expected: "2025/12/30 12:34:56.789",
    },
  ])("returns $expected for $dateValue formatType: $formatType", ({
    dateValue,
    formatType,
    expected,
  }) => {
    const formattedTime = formatTime(
      new Date(dateValue),
      formatType,
    );
    expect(formattedTime).toBe(expected);
  });
});
