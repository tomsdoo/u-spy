const logTimeFormatterHhMmSsFff = new Intl.DateTimeFormat("en-US", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

const logTimeFormatterYyyyMMddHhMmSsFff = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

export enum FormatType {
  HH_MM_SS_FFF = "HH:mm:ss.fff",
  YYYY_MM_DD_HH_MM_SS_FFF = "yyyy/MM/dd HH:mm:ss.fff",
}

const formatterMap = new Map([
  [FormatType.HH_MM_SS_FFF, logTimeFormatterHhMmSsFff],
  [FormatType.YYYY_MM_DD_HH_MM_SS_FFF, logTimeFormatterYyyyMMddHhMmSsFff],
]);

export function formatTime(dateValue: Date, format: string = FormatType.HH_MM_SS_FFF) {
  const {
    formatName,
    isFreeFormat,
  } = (() => {
    switch (format) {
      case FormatType.YYYY_MM_DD_HH_MM_SS_FFF:
        return {
          formatName: FormatType.YYYY_MM_DD_HH_MM_SS_FFF,
          isFreeFormat: false,
        };
      case FormatType.HH_MM_SS_FFF:
        return {
          formatName: FormatType.HH_MM_SS_FFF,
          isFreeFormat: false,
        };
      default:
        return {
          formatName: FormatType.YYYY_MM_DD_HH_MM_SS_FFF,
          isFreeFormat: true,
        };
    }
  })();
  const formatter = formatterMap.get(formatName) ?? logTimeFormatterHhMmSsFff;
  const result = formatter.format(dateValue);
  if (!isFreeFormat) {
    return result;
  }
  const [ymd,hmsf] = result.split(/\s/);
  const [
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  ] = [...ymd.split(/\//), ...hmsf.split(/[:.]/)];
  return format
    .replace(/yyyy/g, year)
    .replace(/MM/g, month)
    .replace(/dd/g, day)
    .replace(/HH/g, hour)
    .replace(/mm/g, minute)
    .replace(/ss/g, second)
    .replace(/fff/g, millisecond);
}
