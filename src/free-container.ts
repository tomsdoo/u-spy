export function createFreeContainer() {
  const containerMap = new Map<string, unknown>();

  const keyTokenMap = new Map<string, string>();

  const subscriptionMap = new Map<string, Set<(value: unknown) => void>>();

  type Container = Record<string, unknown> & {
    new: () => ReturnType<typeof createFreeContainer>;
    set: (key: string, value: unknown, token?: string) => string;
    subscribe: (key: string, callback: (value: unknown) => void) => () => void;
    unsubscribe: (key: string, callback: (value: unknown) => void) => void;
    delete: (key: string, token: string) => void;
  };

  const reservedProps = [
    "new",
    "set",
    "delete",
    "keys",
    "subscribe",
    "unsubscribe",
  ];

  return new Proxy(
    {
      new() {
        return createFreeContainer();
      },
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
        }
        containerMap.set(key, value);
        for (const callback of subscriptionMap.get(key) ?? []) {
          callback(value);
        }
        const nextToken = token ?? crypto.randomUUID();
        if (token !== nextToken) {
          keyTokenMap.set(key, nextToken);
        }
        return nextToken;
      },
      subscribe(key: string, callback: (value: unknown) => void) {
        if (subscriptionMap.has(key) === false) {
          subscriptionMap.set(key, new Set());
        }
        subscriptionMap.get(key)?.add(callback);
        return () => {
          subscriptionMap.get(key)?.delete(callback);
        };
      },
      unsubscribe(key: string, callback: (value: unknown) => void) {
        subscriptionMap.get(key)?.delete(callback);
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
}

export const freeContainer = createFreeContainer();
