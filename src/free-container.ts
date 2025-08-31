const containerMap = new Map<string, any>();

const keyTokenMap = new Map<string, string>();

type Container = Record<string, any> & {
  set: (key: string, value: any, token?: string) => string;
  delete: (key: string, token: string) => void;
};

export const freeContainer = new Proxy({
  set(key: string, value: any, token?: string) {
    if (containerMap.has(key)) {
      if (token == null) {
        throw new Error(`value of ${key} is already set. token is required to overwrite it.`);
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
} as Container,{
  get(target, prop, receiver) {
    const isThrough = typeof prop === "symbol" ||
      ["set", "delete"].includes(prop);
    if (isThrough) {
      return Reflect.get(target, prop, receiver);
    }
    return containerMap.get(prop);
  },
  set(target, prop, value, receiver) {
    return true;
  }
});
