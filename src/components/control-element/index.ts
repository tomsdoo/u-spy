import { template } from "./template";

const TAG_NAME = "u-spy-control-element";

export const CONTROL_EVENT = 'u-spy-control';

export enum ControlEvents {
  XHR_LOAD = 'xhr_load',
  FETCH = 'fetch',
}

type XhrLoadEventData = {
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: unknown;
  response: unknown;
  status: number;
  responseHeaders: Record<string, string>;
  responseType: XMLHttpRequestResponseType;
  responseURL: string;
  readyState: number;
  responseText: string;
  responseXML: Document | null;
};

type XhrLoadEvent = {
  type: ControlEvents.XHR_LOAD;
  data: XhrLoadEventData;
};

type FetchEventData = {
  input: RequestInfo | URL;
  init?: RequestInit;
  response: Response;
};

type FetchEvent = {
  type: ControlEvents.FETCH;
  data: FetchEventData;
};

export type ControlEventDetail =
  | XhrLoadEvent
  | FetchEvent;

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: ControlElement;
  }

  interface HTMLElementEventMap {
    [CONTROL_EVENT]: CustomEvent<ControlEventDetail>;
  }
}

type FetchHandler = (data: FetchEventData) => void;
type XhrLoadHandler = (data: XhrLoadEventData) => void;
type Handler =
  | FetchHandler
  | XhrLoadHandler;

export class ControlElement extends HTMLElement {
  eventHandlerMap: Map<ControlEvents, { handler: Handler; wrapper: Function; }[]>;
  events = ControlEvents;
  logStore: {
    [ControlEvents.FETCH]: { id: string; time: Date; data: FetchEventData; }[];
    [ControlEvents.XHR_LOAD]: { id: string; time: Date; data: XhrLoadEventData; }[];
  } = {
    [ControlEvents.FETCH]: [],
    [ControlEvents.XHR_LOAD]: [],
  };
  constructor() {
    super();
    this.eventHandlerMap = new Map();
  }
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(document.createRange().createContextualFragment(template));
    const [anchor, hrefAttr] = [
      shadowRoot.querySelector("a"),
      shadowRoot.host.attributes.getNamedItem("href"),
    ];
    if (anchor != null && hrefAttr != null) {
      anchor.setAttribute("href", hrefAttr.value);
    }
  }
  on(event: ControlEvents.FETCH, handler: FetchHandler): void;
  on(event: ControlEvents.XHR_LOAD, handler: XhrLoadHandler): void;
  on(event: ControlEvents, handler: Handler) {
    const existingHandlers = this.eventHandlerMap.get(event) ?? [];
    const exists = existingHandlers.find(({ handler: existingHandler}) => existingHandler === handler) != null;
    if (exists) {
      return;
    }
    const wrapper = (e: { detail: ControlEventDetail }) => {
      if (e.detail.type !== event) {
        return;
      }
      switch(event) {
        case ControlEvents.FETCH:
          (handler as FetchHandler)(e.detail.data as FetchEventData);
          return;
        case ControlEvents.XHR_LOAD:
          (handler as XhrLoadHandler)(e.detail.data as XhrLoadEventData);
          return;
        default:
          return;
      }
    };
    this.eventHandlerMap.set(
      event,
      existingHandlers
        .filter(({handler: existingHandler }) => existingHandler !== handler)
        .concat([{ handler, wrapper }]),
    );
    this.addEventListener(CONTROL_EVENT, wrapper);
  }
  off(event: ControlEvents, handler: Handler) {
    const existingHandlers = this.eventHandlerMap.get(event) ?? [];
    const exists = existingHandlers.find(({ handler: existingHandler}) => existingHandler === handler);
    if (exists == null) {
      return;
    }
    this.eventHandlerMap.set(
      event,
      existingHandlers.filter(({ handler: existingHandler }) => existingHandler !== handler),
    );
    this.removeEventListener(CONTROL_EVENT, exists.wrapper as () => void);
  }
  dispatchXhrLoad(data: XhrLoadEventData) {
    this.logStore[ControlEvents.XHR_LOAD].push({
      data,
      time: new Date(),
      id: `log-item-xhr-${crypto.randomUUID()}`,
    });
    this.dispatchEvent(new CustomEvent(CONTROL_EVENT, {
      bubbles: false,
      detail: {
        type: ControlEvents.XHR_LOAD,
        data,
      },
    }));
  }
  dispatchFetch(data: FetchEventData) {
    this.logStore[ControlEvents.FETCH].push({
      data: {
        ...data,
        response: data.response.clone(),
      },
      time: new Date(),
      id: `log-item-fetch-${crypto.randomUUID()}`,
    });
    this.dispatchEvent(new CustomEvent(CONTROL_EVENT, {
      bubbles: false,
      detail: {
        type: ControlEvents.FETCH,
        data,
      },
    }));
  }
  static create(id: string) {
    const ele = document.createElement(TAG_NAME);
    ele.setAttribute("id", id);
    ele.style.display = "none";
    document.body.appendChild(ele);
    return ele;
  }
  static ensure(id: string) {
    const existing = document.getElementById(id);
    if (existing != null) {
      return existing as ControlElement;
    } 
    return this.create(id);
  }
  static list() {
    return  Array.from(document.querySelectorAll(TAG_NAME));
  }
}


try {
  globalThis.customElements.define(TAG_NAME, ControlElement);
} catch {}

