function getNewLineChar(nl: number = 10) {
  return String.fromCharCode(nl);
}

export function decodeToRecord(str: string): Record<string, string> | null {
  try {
    const trimmedStr = str.trim();
    if (!trimmedStr.startsWith("{") || !trimmedStr.endsWith("}")) {
      return null;
    }
    const textInsideBlock = trimmedStr
      .replace(/^\{/, "")
      .replace(/\}$/, "")
      .replace(/,/g, getNewLineChar());
    const keyValueLines = textInsideBlock
      .split(getNewLineChar())
      .map((line) => line.trim())
      .filter(Boolean);

    const record: Record<string, string> = {};
    for (const line of keyValueLines) {
      const [key, value] = line
        .trim()
        .split(/:/)
        .map((s) => s.trim());
      if (key == null || value == null) {
        return null;
      }
      const cleanedKey = key.replace(/^['"]|['"]$/g, "");
      const cleanedValue = value.replace(/^['"]|['"]$/g, "");
      record[cleanedKey] = cleanedValue;
    }
    return record;
  } catch {
    return null;
  }
}
