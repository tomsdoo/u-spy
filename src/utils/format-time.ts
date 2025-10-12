const logTimeFormatterHhMmSsFff = new Intl.DateTimeFormat("en-US", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

export enum FormatType {
  HH_MM_SS_FFF = "hh:mm:ss.fff",
}

const formatterMap = new Map([
  [FormatType.HH_MM_SS_FFF, logTimeFormatterHhMmSsFff]
]);

export function formatTime(dateValue: Date, format: string = FormatType.HH_MM_SS_FFF) {
  const formatName = (() => {
    switch (format) {
      case FormatType.HH_MM_SS_FFF:
        return FormatType.HH_MM_SS_FFF;
      default:
        return FormatType.HH_MM_SS_FFF;
    }
  })();
  const formatter = formatterMap.get(formatName) ?? logTimeFormatterHhMmSsFff;
  return formatter.format(dateValue);
}
