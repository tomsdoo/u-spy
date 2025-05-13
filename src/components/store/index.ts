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
  constructor() {
    super();
    this.eventHandlerMap = new Map();
    this._keyDefinitions = [];
    this._temporaryDataMap = new Map();
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

try {
  globalThis.customElements.define(TAG_NAME, StoreElement);
} catch {}
