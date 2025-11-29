import { interceptSendBeacon } from "@/beacon";
import { ControlElement } from "@/components/control-element";
import { displayDialog } from "@/components/dialog";
import { ensureCustomElement } from "@/components/dynamic-element";
import { ensureCustomIterator } from "@/components/dynamic-element/iterator";
import { ensureTemplateView } from "@/components/dynamic-element/template-view";
import { EntryPointElement } from "@/components/entry-point";
import { IframeModalElement } from "@/components/iframe-modal";
import { LifeGameElement } from "@/components/life-game";
import { MediaModalElement } from "@/components/media-modal";
import { showEphemeralMessage } from "@/components/popup";
import { ensureStore, getStoreIds, StoreElement } from "@/components/store";
import { eventBus } from "@/event-bus";
import { interceptFetch, type MockFetchHandler } from "@/fetch";
import { freeContainer } from "@/free-container";
import {
  getRegisteredHotStroke,
  getRegisteredHotStrokes,
  registerHotStroke,
} from "@/key-event";
import { storage } from "@/storage";
import {
  deflate,
  download,
  formatTime,
  loadScript,
  prettierFormat,
  type Replacer,
  replaceContent,
  sleep,
} from "@/utils";
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
    ensureTemplateView: typeof ensureTemplateView;
  };
  dialog: {
    display(
      callback: (dialogElement: HTMLElement) => void,
      options?: { title?: string },
    ): void;
    displaySpy(): void;
    displayStyle(): void;
    displayCode(): void;
  };
  eventBus: typeof eventBus;
  iframe: {
    display: (url: string) => void;
  };
  images: {
    display: (
      imageUrls: string | string[],
      options?: { interval?: number },
    ) => void;
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
  utils: {
    deflate: typeof deflate;
    download: typeof download;
    formatTime: typeof formatTime;
    loadScript: typeof loadScript;
    prettierFormat: typeof prettierFormat;
    sleep: typeof sleep;
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

function displayImages(
  imageUrls: string | string[],
  options?: { interval?: number },
) {
  const typedImageUrls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  if (typedImageUrls.length === 0) {
    return;
  }
  const mediaModalElement = MediaModalElement.create();
  mediaModalElement.setAttribute(":state", "paused");
  if (options?.interval != null) {
    mediaModalElement.setAttribute(":cycle-interval", String(options.interval));
  }
  mediaModalElement.setAttribute(":images", JSON.stringify(typedImageUrls));
  document.body.appendChild(mediaModalElement);
  mediaModalElement.setAttribute(":state", "running");
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

const _spy = {
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
    ensureTemplateView,
  },
  images: {
    display: displayImages,
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
  utils: {
    deflate,
    download,
    formatTime,
    loadScript,
    prettierFormat,
    sleep,
  },
  showEphemeralMessage,
  replaceText(replacers: Replacer | Replacer[], selector?: string) {
    replaceContent(selector ?? "*", replacers);
  },
};

Object.freeze(_spy);
Object.freeze(_spy.customElement);
Object.freeze(_spy.dialog);
Object.freeze(_spy.iframe);
Object.freeze(_spy.images);
Object.freeze(_spy.store);
Object.freeze(_spy.stroke);
Object.freeze(_spy.eventBus);
Object.freeze(_spy.utils);

Object.defineProperty(globalThis, "_spy", {
  value: _spy,
  writable: false,
  configurable: false,
});

export { _spy };

document.currentScript?.remove();
