import { EntryPointElement } from "@/components/entry-point";

const TAG_NAME = "u-spy-message-bus";

export enum MessageBusEvent {
  GENERAL = "general",
}

type GeneralEventData = unknown;

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: MessageBusElement;
  }

  interface HTMLElementEventMap {
    [MessageBusEvent.GENERAL]: CustomEvent<GeneralEventData>;
  }
}

type GeneralHandler = (data: GeneralEventData) => void;
type Handler = GeneralHandler;

export class MessageBusElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  eventHandlerMap: Map<
    MessageBusEvent,
    // biome-ignore lint/complexity/noBannedTypes: use Function
    { handler: Handler; wrapper: Function }[]
  >;
  constructor() {
    super();
    this.eventHandlerMap = new Map();
  }
  on(event: MessageBusEvent.GENERAL, handler: GeneralHandler): void;
  on(event: MessageBusEvent, handler: Handler) {
    const existingHandlers = this.eventHandlerMap.get(event) ?? [];
    const exists =
      existingHandlers.find(
        ({ handler: existingHandler }) => existingHandler === handler,
      ) != null;
    if (exists) {
      return;
    }
    switch (event) {
      case MessageBusEvent.GENERAL: {
        const wrapper = (e: { detail: GeneralEventData }) => {
          (handler as GeneralHandler)(e.detail);
        };
        this.eventHandlerMap.set(
          event,
          existingHandlers
            .filter(
              ({ handler: existingHandler }) => existingHandler !== handler,
            )
            .concat([{ handler, wrapper }]),
        );
        return;
      }
      default: {
        return;
      }
    }
  }
  off(event: MessageBusEvent, handler: Handler) {
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
  static create(id?: string) {
    const ele = document.createElement(MessageBusElement.TAG_NAME);
    ele.style.display = "none";
    if (id != null) {
      ele.id = id;
    }
    EntryPointElement.ensure().appendChild(ele);
    return ele as MessageBusElement;
  }
  static ensure(id?: string) {
    const selector = id
      ? `${MessageBusElement.TAG_NAME}[id='${id}']`
      : `${MessageBusElement.TAG_NAME}:not([id])`;
    const existing = document.querySelector<MessageBusElement>(selector);
    if (existing != null) {
      return existing;
    }
    return MessageBusElement.create(id);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, MessageBusElement);
} catch {}
