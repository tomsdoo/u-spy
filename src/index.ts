import { interceptSendBeacon } from "@/beacon";
import { ControlElement } from "@/components/control-element";
import { displayDialog } from "@/components/dialog";
import { ensureCustomElement } from "@/components/dynamic-element";
import { ensureCustomIterator } from "@/components/dynamic-element/iterator";
import { EntryPointElement } from "@/components/entry-point";
import { IframeModalElement } from "@/components/iframe-modal";
import { LifeGameElement } from "@/components/life-game";
import { showEphemeralMessage } from "@/components/popup";
import { ensureStore, getStoreIds, StoreElement } from "@/components/store";
import { type Replacer, UtilsElement } from "@/components/utils";
import { eventBus } from "@/event-bus";
import { interceptFetch, type MockFetchHandler } from "@/fetch";
import { freeContainer } from "@/free-container";
import {
  getRegisteredHotStroke,
  getRegisteredHotStrokes,
  registerHotStroke,
} from "@/key-event";
import { storage } from "@/storage";
import { interceptWindowMessage } from "@/window-message";
import {
  interceptXMLHttpRequest,
  type MockXHRHandler,
} from "@/xml-http-request";

// biome-ignore lint/correctness/noUnusedVariables: divided
interface Spy {
  c: typeof freeContainer;
  container: typeof freeContainer;
  storage: typeof storage;
  customElement: {
    ensure: typeof ensureCustomElement;
    ensureIterator: typeof ensureCustomIterator;
  };
  dialog: {
    display(callback: (dialogElement: HTMLElement) => void): void;
    displaySpy(): void;
    displayStyle(): void;
    displayCode(): void;
  };
  eventBus: typeof eventBus;
  iframe: {
    display: (url: string) => void;
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
    replace(
      beforeKey: string,
      afterKey: string,
    ): ReturnType<typeof registerHotStroke> | null;
  };
}

interface Spy {
  intercept(
    id: string,
    options?: InterceptionOptions,
  ): {
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

function displaySpyDialog() {
  return displayDialog("spy");
}

function displayStyleDialog() {
  return displayDialog("style");
}

function displayCodeDialog() {
  return displayDialog("code");
}

function displayLifeGame() {
  const lifeGameElement = LifeGameElement.create();
  lifeGameElement.setAttribute(":board-width", "50");
  lifeGameElement.setAttribute(":board-height", "30");
  document.body.appendChild(lifeGameElement);
}

function displayReference() {
  const iframeModalElement = IframeModalElement.create();
  iframeModalElement.setAttribute(":src", "https://tomsdoo.github.io/u-spy/");
  document.body.appendChild(iframeModalElement);
}

for (const { stroke, display } of [
  {
    stroke: "spy",
    display: displaySpyDialog,
  },
  {
    stroke: "style",
    display: displayStyleDialog,
  },
  {
    stroke: "code",
    display: displayCodeDialog,
  },
  {
    stroke: "life",
    display: displayLifeGame,
  },
  {
    stroke: "help",
    display: displayReference,
  },
]) {
  registerHotStroke(stroke, () => {
    display();
  });
}

globalThis._spy = {
  intercept(id: string, options?: InterceptionOptions) {
    const receiver = ControlElement.ensure(id);
    const { restoreXMLHttpRequest } = interceptXMLHttpRequest(
      id,
      options?.xhrHandlers,
    );
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
  c: freeContainer,
  container: freeContainer,
  customElement: {
    ensure: ensureCustomElement,
    ensureIterator: ensureCustomIterator,
  },
  dialog: {
    display(
      callback: (dialogElement: HTMLElement) => void,
      options?: { title?: string },
    ) {
      return displayDialog(callback, options);
    },
    displaySpy() {
      return displaySpyDialog();
    },
    displayStyle() {
      return displayStyleDialog();
    },
    displayCode() {
      return displayCodeDialog();
    },
  },
  iframe: {
    display(url: string) {
      const iframeModalElement = IframeModalElement.create();
      iframeModalElement.setAttribute(":src", url);
      document.body.appendChild(iframeModalElement);
    },
  },
  eventBus,
  storage,
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
  showEphemeralMessage,
  replaceText(replacers: Replacer | Replacer[], selector?: string) {
    UtilsElement.ensure().replaceContent(selector ?? "*", replacers);
  },
};
