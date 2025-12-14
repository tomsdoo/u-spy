type PrimitiveValue =
  | boolean
  | number
  | string
  | null
  | undefined
  | symbol
  | bigint;

type DeflatedValue = PrimitiveValue | Date | RegExp;

function isPrimitive(value: unknown): value is PrimitiveValue {
  if (value === null) {
    return true;
  }
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
      return true;
    default:
      return false;
  }
}

export function deflate(value: unknown) {
  if (isPrimitive(value) || value instanceof Date || value instanceof RegExp) {
    return value;
  }

  if (
    typeof value !== "object" ||
    value === null ||
    value instanceof Date ||
    value instanceof RegExp ||
    value === Math ||
    value === JSON ||
    value === Intl ||
    value instanceof Promise ||
    value instanceof Set ||
    value instanceof WeakSet ||
    value instanceof WeakMap
  ) {
    throw new Error("invalid input");
  }
  const record: Record<
    string,
    DeflatedValue | Array<Record<string, DeflatedValue> | DeflatedValue>
  > = {};
  (function getKeyValue(obj: unknown, keyPrefix: string = "") {
    if (Array.isArray(obj)) {
      record[keyPrefix] = obj;
      obj.forEach((value, index) => {
        const nextKey = `${keyPrefix}[${index}]`;
        getKeyValue(value, nextKey);
      });
      return;
    }
    if (typeof obj === "object") {
      if (obj === null || obj instanceof Date || obj instanceof RegExp) {
        if (keyPrefix !== "") {
          record[keyPrefix] = obj;
        }
        return;
      }
      if (
        obj === Math ||
        obj === JSON ||
        obj === Intl ||
        obj instanceof Promise
      ) {
        return;
      }
      if (
        obj instanceof Set ||
        obj instanceof WeakSet ||
        obj instanceof WeakMap
      ) {
        return;
      }
      if (obj instanceof Map) {
        obj.entries().forEach(([key, value]) => {
          const nextKey = `${keyPrefix}${keyPrefix ? "." : ""}${key}`;
          getKeyValue(value, nextKey);
        });
        return;
      }
      Object.entries(obj).forEach(([key, value]) => {
        const nextKey = `${keyPrefix}${keyPrefix ? "." : ""}${key}`;
        getKeyValue(value, nextKey);
      });
      return;
    }
    if (keyPrefix !== "" && isPrimitive(obj)) {
      record[keyPrefix] = obj;
    }
  })(value);
  return record;
}

export function pickPropertyFromDeflatedItem(
  deflatedItem: ReturnType<typeof deflate>,
  propName: string,
) {
  if (propName === ".") {
    return deflatedItem;
  }
  if (
    isPrimitive(deflatedItem) ||
    deflatedItem instanceof Date ||
    deflatedItem instanceof RegExp
  ) {
    return deflatedItem;
  }
  return deflatedItem[propName] ?? null;
}
