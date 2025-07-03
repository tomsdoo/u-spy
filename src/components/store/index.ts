import { EntryPointElement } from "@/components/entry-point";

const TAG_NAME = "u-spy-store";

export enum StoreEvent {
  CHANGE_KEY_DEFINITIONS = 'change_key_definitions',
}

type ChangeKeyDefinitionEventData = {
  value: { key: string; description: string; }[];
  oldValue: { key: string; description: string; }[];
};

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: StoreElement;
  }

  interface HTMLElementEventMap {
    [StoreEvent.CHANGE_KEY_DEFINITIONS]: CustomEvent<ChangeKeyDefinitionEventData>;
  }
}

type ChangeKeyDefinitionHandler = (data: ChangeKeyDefinitionEventData) => void;
type Handler =
  | ChangeKeyDefinitionHandler;

export class StoreElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  eventHandlerMap: Map<StoreEvent, { handler: Handler; wrapper: Function; }[]>;
  _keyDefinitions: { key: string; description: string; }[];
  _temporaryDataMap: Map<string, unknown>;
  _freeData: Map<string, ObservableObject>;
  constructor() {
    super();
    this.eventHandlerMap = new Map();
    this._keyDefinitions = [];
    this._temporaryDataMap = new Map();
    this._freeData = new Map();
  }
  get keyDefinitions() {
    return this._keyDefinitions.slice()
      .toSorted((a,b) => {
        if (a.key === b.key) {
          return 0;
        }
        return a.key > b.key ? 1 : -1;
      });
  }
  set keyDefinitions(value: { key: string; description: string; }[]) {
    const eventDetail = {
      value: value.slice(),
      oldValue: this.keyDefinitions,
    };
    this._keyDefinitions = value;
    this.dispatchEvent(new CustomEvent(StoreEvent.CHANGE_KEY_DEFINITIONS, {
      bubbles: false,
      detail: eventDetail,
    }));
  }
  get freeData() {
    return this._freeData;
  }
  addKeyDefinition(keyDefinition: { key: string; description: string; }) {
    this.keyDefinitions = this.keyDefinitions
      .filter(({ key }) => keyDefinition.key !== key)
      .concat([keyDefinition]);
  }
  removeKeyDefinition(key: string) {
    this.keyDefinitions = this.keyDefinitions
      .filter((keyDefinition) => keyDefinition.key !== key);
  }
  getTemporaryData(key: string) {
    return this._temporaryDataMap.get(key) ?? "";
  }
  addTemporaryData(data: unknown, key?: string) {
    const dataKey = key ?? crypto.randomUUID();
    this._temporaryDataMap.set(
      dataKey,
      data,
    );
    return dataKey;
  }
  removeTemporaryData(key: string) {
    this._temporaryDataMap.delete(key);
  }
  on(event: StoreEvent.CHANGE_KEY_DEFINITIONS, handler: ChangeKeyDefinitionHandler): void;
  on(event: StoreEvent, handler: Handler) {
    const existingHandlers = this.eventHandlerMap.get(event) ?? [];
    const exists = existingHandlers.find(({ handler: existingHandler }) => existingHandler === handler) != null;
    if (exists) {
      return;
    }
    switch (event) {
      case StoreEvent.CHANGE_KEY_DEFINITIONS: {
        const wrapper = (e: {detail: ChangeKeyDefinitionEventData}) => {
          (handler as ChangeKeyDefinitionHandler)(e.detail);
        };
        this.eventHandlerMap.set(
          event,
          existingHandlers
            .filter(({handler: existingHandler}) => existingHandler !== handler)
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
    const exists = existingHandlers.find(({ handler: existingHandler}) => existingHandler === handler);
    if (exists == null) {
      return;
    }
    this.eventHandlerMap.set(
      event,
      existingHandlers.filter(({ handler: existingHandler }) => existingHandler !== handler),
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
    const existing = document.querySelector<StoreElement>(StoreElement.TAG_NAME);
    if (existing != null) {
      return existing;
    }
    return this.create();
  }
}

type OnChangeHandler = (prop: string, neWValue: unknown, oldValue: unknown) => void;
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
        this._onChangeHandlers = this._onChangeHandlers.filter(handler => handler !== f);
      }
    } as ObservableObject,
    {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, newValue, receiver) {
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
        for(const handler of obj._onChangeHandlers as OnChangeHandler[]) {
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
    storeElement.freeData.set(
      id,
      generateObservableObject(),
    );
  }
  return storeElement.freeData.get(id)!;
}

try {
  globalThis.customElements.define(TAG_NAME, StoreElement);
} catch {}
