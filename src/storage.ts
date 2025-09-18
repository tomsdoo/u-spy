type StorageProxy = Record<string, string> & {
  delete: (key: string) => void;
};

const reservedProps = ["delete", "keys"];

const PREFIX = "uss_";

export function createStorageProxy(PREFIX: string) {
  const REGEXP_PREFIX = new RegExp(`^${PREFIX}`);

  function addPrefix(value: string) {
    return `${PREFIX}${value}`;
  }

  function removePrefix(value: string) {
    return value.replace(REGEXP_PREFIX, "");
  }

  const storage = new Proxy(
    {
      delete(key: string) {
        localStorage.removeItem(addPrefix(key));
      },
    } as StorageProxy,
    {
      get(target, prop, receiver) {
        if (prop === "keys") {
          const rawKeys = Array.from(
            { length: localStorage.length },
            (_v, i) => i,
          )
            .map((i) => localStorage.key(i))
            .filter((key) => key != null);
          return rawKeys
            .filter((rawKey) => rawKey?.match(REGEXP_PREFIX) != null)
            .map(removePrefix);
        }
        const isThrough =
          typeof prop === "symbol" || reservedProps.includes(prop);
        if (isThrough) {
          return Reflect.get(target, prop, receiver);
        }
        return localStorage.getItem(addPrefix(prop));
      },
      set(_target, prop, value, _receiver) {
        const isThrough =
          typeof prop === "symbol" || reservedProps.includes(prop);
        if (isThrough) {
          return true;
        }
        localStorage.setItem(addPrefix(prop), value);
        return true;
      },
    },
  );
  return storage;
}

export const storage = createStorageProxy(PREFIX);
