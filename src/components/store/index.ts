import { EntryPointElement } from "@/components/entry-point";

const TAG_NAME = "u-spy-store";

export enum StoreEvent {
  DUMMY = "dummy",
}

type DummyEventData = {
  value: string;
};

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: StoreElement;
  }

  interface HTMLElementEventMap {
    [StoreEvent.DUMMY]: CustomEvent<DummyEventData>;
  }
}
type DummyHandler = (data: DummyEventData) => void;
type Handler = DummyHandler;

export class StoreElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  // biome-ignore lint/complexity/noBannedTypes: use Function
  eventHandlerMap: Map<StoreEvent, { handler: Handler; wrapper: Function }[]>;
  _temporaryDataMap: Map<string, unknown>;
  _freeData: Map<string, ObservableObject>;
  constructor() {
    super();
    this.eventHandlerMap = new Map();
    this._temporaryDataMap = new Map();
    this._freeData = new Map();
  }
  get freeData() {
    return this._freeData;
  }
  getTemporaryData(key: string) {
    return this._temporaryDataMap.get(key) ?? "";
  }
  addTemporaryData(data: unknown, key?: string) {
    const dataKey = key ?? crypto.randomUUID();
    this._temporaryDataMap.set(dataKey, data);
    return dataKey;
  }
  removeTemporaryData(key: string) {
    this._temporaryDataMap.delete(key);
  }
  on(event: StoreEvent, handler: Handler) {
    const existingHandlers = this.eventHandlerMap.get(event) ?? [];
    const exists =
      existingHandlers.find(
        ({ handler: existingHandler }) => existingHandler === handler,
      ) != null;
    if (exists) {
      return;
    }
    switch (event) {
      case StoreEvent.DUMMY: {
        const wrapper = (e: { detail: DummyEventData }) => {
          (handler as DummyHandler)(e.detail);
        };
        this.eventHandlerMap.set(
          event,
          existingHandlers
            .filter(
              ({ handler: existingHandler }) => existingHandler !== handler,
            )
            .concat([{ handler, wrapper }]),
        );
        this.addEventListener(event, wrapper);
        return;
      }
      default: {
        return;
      }
    }
  }
  off(event: StoreEvent, handler: Handler) {
    const existingHandlers = this.eventHandlerMap.get(event) ?? [];
    const exists = existingHandlers.find(
      ({ handler: existingHandler }) => existingHandler === handler,
    );
    if (exists == null) {
      return;
    }
    this.eventHandlerMap.set(
      event,
      existingHandlers.filter(
        ({ handler: existingHandler }) => existingHandler !== handler,
      ),
    );
    this.removeEventListener(event, exists.wrapper as () => void);
  }
  static create() {
    const ele = document.createElement(StoreElement.TAG_NAME);
    ele.style.display = "none";
    EntryPointElement.ensure().appendChild(ele);
    return ele as StoreElement;
  }
  static ensure() {
    const existing = document.querySelector<StoreElement>(
      StoreElement.TAG_NAME,
    );
    if (existing != null) {
      return existing;
    }
    return StoreElement.create();
  }
}

type OnChangeHandler = (
  prop: string,
  neWValue: unknown,
  oldValue: unknown,
) => void;
type ObservableObject = Record<string, unknown> & {
  _onChangeHandlers: OnChangeHandler[];
  onChange: (f: OnChangeHandler) => void;
  offChange: (f: OnChangeHandler) => void;
};
function generateObservableObject() {
  const obj = new Proxy(
    {
      _onChangeHandlers: [],
      onChange(f: OnChangeHandler) {
        this._onChangeHandlers.push(f);
      },
      offChange(f: OnChangeHandler) {
        this._onChangeHandlers = this._onChangeHandlers.filter(
          (handler) => handler !== f,
        );
      },
    } as ObservableObject,
    {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, newValue, _receiver) {
        if (typeof prop === "symbol") {
          return true;
        }
        if (["onChange", "offChange"].includes(prop)) {
          return true;
        }
        if (["_onChangeHandlers"].includes(prop)) {
          target[prop] = newValue;
          return true;
        }
        const oldValue = target[prop];
        target[prop] = newValue;
        for (const handler of obj._onChangeHandlers as OnChangeHandler[]) {
          void handler(prop, newValue, oldValue);
        }
        return true;
      },
    },
  );
  return obj;
}

export function ensureStore(id: string) {
  const storeElement = StoreElement.ensure();
  if (storeElement.freeData.has(id) === false) {
    storeElement.freeData.set(id, generateObservableObject());
  }
  // biome-ignore lint/style/noNonNullAssertion: certainly exists
  return storeElement.freeData.get(id)!;
}

export function getStoreIds() {
  const storeElement = StoreElement.ensure();
  return Array.from(storeElement.freeData.keys());
}

try {
  globalThis.customElements.define(TAG_NAME, StoreElement);
} catch {}
