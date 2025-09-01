const containerMap = new Map<string, unknown>();

const keyTokenMap = new Map<string, string>();

type Container = Record<string, unknown> & {
  set: (key: string, value: unknown, token?: string) => string;
  delete: (key: string, token: string) => void;
};

const reservedProps = ["set", "delete", "keys"];

export const freeContainer = new Proxy(
  {
    set(key: string, value: unknown, token?: string) {
      if (reservedProps.includes(key)) {
        throw new Error(`${key} is reserved`);
      }
      if (containerMap.has(key)) {
        if (token == null) {
          throw new Error(
            `value of ${key} is already set. token is required to overwrite it.`,
          );
        }
        if (keyTokenMap.get(key) !== token) {
          throw new Error(`token:${token} for key:${key} is invalid`);
        }
        containerMap.set(key, value);
        return token;
      }
      const newToken = crypto.randomUUID();
      keyTokenMap.set(key, newToken);
      containerMap.set(key, value);
      return newToken;
    },
    delete(key: string, changeToken: string) {
      if (!containerMap.has(key)) {
        return;
      }
      if (keyTokenMap.get(key) !== changeToken) {
        return;
      }
      keyTokenMap.delete(key);
      containerMap.delete(key);
    },
  } as Container,
  {
    get(target, prop, receiver) {
      if (prop === "keys") {
        return Array.from(containerMap.keys());
      }
      const isThrough =
        typeof prop === "symbol" || reservedProps.includes(prop);
      if (isThrough) {
        return Reflect.get(target, prop, receiver);
      }
      return containerMap.get(prop);
    },
    set(_target, _prop, _value, _receiver) {
      return true;
    },
  },
);
