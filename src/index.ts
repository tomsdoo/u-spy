import { ControlElement } from "@/components/control-element";
import { StoreElement, ensureStore, getStoreIds } from "@/components/store";
import { EntryPointElement } from "@/components/entry-point";
import { interceptXMLHttpRequest, type MockXHRHandler } from "@/xml-http-request";
import { interceptFetch, type MockFetchHandler } from "@/fetch";
import { interceptSendBeacon } from "@/beacon";
import { interceptWindowMessage } from "@/window-message";
import { displayDialog } from "@/components/dialog";
import { registerHotStroke, getRegisteredHotStrokes, getRegisteredHotStroke } from "@/key-event";
import { MessageBusElement } from "@/components/message-bus";
import { ensureCustomElement } from "@/components/dynamic-element";
import { ensureCustomIterator } from "@/components/dynamic-element/iterator";
import { showEphemeralMessage } from "@/components/popup";
import { UtilsElement, type Replacer } from "@/components/utils";

interface Spy {
  customElement: {
    ensure: typeof ensureCustomElement;
    ensureIterator: typeof ensureCustomIterator;
  };
  dialog: {
    display(callback: (dialogElement: HTMLElement) => void): void;
    displaySpy(): void;
    displayStyle(): void;
  };
  store: {
    keys: string[];
    ensure(key: string): ReturnType<typeof ensureStore>;
  };
  stroke: {
    register: typeof registerHotStroke;
    get keys(): string[];
    get(key: string): ReturnType<typeof getRegisteredHotStroke> | undefined;
    unregister(key: string): void;
    unregisterAll(): void;
    replace(beforeKey: string, afterKey: string): ReturnType<typeof registerHotStroke> | null;
  };
}

// deprecated methods
interface Spy {
  registerHotStroke: typeof registerHotStroke;
  getRegisteredHotStrokes: typeof getRegisteredHotStrokes;
  getRegisteredHotStroke: typeof getRegisteredHotStroke;
  changeHotStrokeSpy(nextStroke: string): ReturnType<typeof registerHotStroke> | null;
  changeHotStrokeStyle(nextStroke: string): ReturnType<typeof registerHotStroke> | null
  unregisterHotStrokes(): void;
  unregisterHotStroke(stroke: string): void;

  displaySpyDialog(): void;
  displayStyleDialog(): void;
  displayDialog(callback: (dialogElement: HTMLElement) => void): void;

  ensureStore: typeof ensureStore;

  ensureCustomElement: typeof ensureCustomElement;
  ensureCustomIterator: typeof ensureCustomIterator;
}

interface Spy {
  intercept(id: string, options?: InterceptionOptions): {
    receiver: ControlElement;
    restore: () => void;
    restoreXMLHttpRequest: () => void;
    restoreFetch: () => void;
    restoreSendBeacon: () => void;
  };
  showEphemeralMessage: typeof showEphemeralMessage;
  replaceText(replacers: Replacer | Replacer[], selector?: string): void;
}

declare global {
  var _spy: Spy;
}

interface InterceptionOptions {
  fetchHandlers?: MockFetchHandler[];
  xhrHandlers?: MockXHRHandler[];
}

EntryPointElement.ensure();
StoreElement.ensure();
MessageBusElement.ensure();

function displaySpyDialog() {
  displayDialog("spy");
}

function displayStyleDialog() {
  displayDialog("style");
}

const unregisterHotStrokeMap = new Map<string, () => void>();

for (const { stroke, display } of [
  {
    stroke: "spy",
    display: displaySpyDialog,
  },
  {
    stroke: "style",
    display: displayStyleDialog,
  },
]) {
  const { unregisterHotStroke } = registerHotStroke(stroke, () => {
    display();
  });
  unregisterHotStrokeMap.set(stroke, unregisterHotStroke);
}

const deprecatedSpy = {
  registerHotStroke(stroke: string, callback: () => void) {
    console.warn("_spy.registerHotStroke is deprecated. Use _spy.stroke.register instead.");
    return registerHotStroke(stroke, callback);
  },
  getRegisteredHotStrokes() {
    console.warn("_spy.getRegisteredHotStrokes is deprecated. Use _spy.stroke.keys instead.");
    return getRegisteredHotStrokes();
  },
  getRegisteredHotStroke(stroke: string) {
    console.warn("_spy.getRegisteredHotStroke is deprecated. Use _spy.stroke.get instead.");
    return getRegisteredHotStroke(stroke);
  },
  changeHotStrokeSpy(nextStroke: string) {
    console.warn("_spy.changeHotStrokeSpy is deprecated. Use _spy.stroke.replace instead.");
    return _spy.stroke.replace("spy", nextStroke);
  },
  changeHotStrokeStyle(nextStroke: string) {
    console.warn("_spy.changeHotStrokeStyle is deprecated. Use _spy.stroke.replace instead.");
    return _spy.stroke.replace("style", nextStroke);
  },
  unregisterHotStrokes() {
    console.warn("_spy.unregisterHotStrokes is deprecated. Use _spy.stroke.unregisterAll instead.");
    for(const unregisterAHotStroke of unregisterHotStrokeMap.values()) {
      unregisterAHotStroke();
    }
  },
  unregisterHotStroke(stroke: string) {
    console.warn("_spy.unregisterHotStroke is deprecated. Use _spy.stroke.unregister instead.");
    getRegisteredHotStroke(stroke)?.unregisterHotStroke();
  },

  displaySpyDialog() {
    console.warn("_spy.displaySpyDialog is deprecated. Use _spy.dialog.displaySpy instead.");
    displaySpyDialog();
  },
  displayStyleDialog() {
    console.warn("_spy.displayStyleDialog is deprecated. Use _spy.dialog.displayStyle instead.");
    displayStyleDialog();
  },
  displayDialog(callback: (dialogElement: HTMLElement) => void) {
    console.warn("_spy.displayDialog is deprecated. Use _spy.dialog.display instead.");
    displayDialog(callback);
  },

  ensureStore(key: string) {
    console.warn("_spy.ensureStore is deprecated. Use _spy.store.ensure instead.");
    return ensureStore(key);
  },
  ensureCustomElement(
    tagName: string,
    config: {
      templateId?: string;
      templateHtml?: string;
      eventHandlers?: Record<string, (e: any) => void>;
    },
  ) {
    console.warn("_spy.ensureCustomElement is deprecated. Use _spy.customElement.ensure instead.");
    ensureCustomElement(tagName, config);
  },
  ensureCustomIterator(customIteratorTagName?: string) {
    console.warn("_spy.ensureCustomIterator is deprecated. Use _spy.customElement.ensureIterator instead.");
    ensureCustomIterator(customIteratorTagName);
  },
};

globalThis._spy = {
  intercept(id: string, options?: InterceptionOptions) {
    const receiver = ControlElement.ensure(id);
    const { restoreXMLHttpRequest } = interceptXMLHttpRequest(id, options?.xhrHandlers);
    const { restoreFetch } = interceptFetch(id, options?.fetchHandlers);
    const { restoreSendBeacon } = interceptSendBeacon(id);
    const { restoreInterceptWindowMessage } = interceptWindowMessage(id);
    function restore() {
      restoreXMLHttpRequest();
      restoreFetch();
      restoreSendBeacon();
      restoreInterceptWindowMessage();
    }
    return {
      receiver,
      restore,
      restoreXMLHttpRequest,
      restoreFetch,
      restoreSendBeacon,
      restoreInterceptWindowMessage,
    };
  },
  customElement: {
    ensure: ensureCustomElement,
    ensureIterator: ensureCustomIterator,
  },
  dialog: {
    display(callback: (dialogElement: HTMLElement) => void) {
      displayDialog(callback);
    },
    displaySpy() {
      displaySpyDialog();
    },
    displayStyle() {
      displayStyleDialog();
    },
  },
  store: {
    get keys() {
      return getStoreIds();
    },
    ensure(key: string) {
      return ensureStore(key);
    },
  },
  stroke: {
    register: registerHotStroke,
    get keys() {
      return getRegisteredHotStrokes();
    },
    get(key: string) {
      return getRegisteredHotStroke(key);
    },
    unregister(key: string) {
      getRegisteredHotStroke(key)?.unregisterHotStroke();
    },
    unregisterAll() {
      for (const key of getRegisteredHotStrokes()) {
        getRegisteredHotStroke(key)?.unregisterHotStroke();
      }
    },
    replace(beforeKey: string, afterKey: string) {
      const beforeDefinition = getRegisteredHotStroke(beforeKey);
      if (beforeDefinition == null) {
        return null;
      }
      const { unregisterHotStroke, handler } = beforeDefinition;
      unregisterHotStroke();
      return registerHotStroke(afterKey, handler);
    },
  },
  ...deprecatedSpy,
  showEphemeralMessage,
  replaceText(replacers: Replacer | Replacer[], selector?: string) {
    UtilsElement.ensure().replaceContent(selector ?? "*", replacers);
  },
};
