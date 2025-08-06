import { ControlElement } from "@/components/control-element";
import { StoreElement, ensureStore } from "@/components/store";
import { EntryPointElement } from "@/components/entry-point";
import { interceptXMLHttpRequest, type MockXHRHandler } from "@/xml-http-request";
import { interceptFetch, type MockFetchHandler } from "@/fetch";
import { interceptSendBeacon } from "@/beacon";
import { displayDialog } from "@/components/dialog";
import { registerHotStroke, getRegisteredHotStrokes, getRegisteredHotStroke } from "@/key-event";
import { MessageBusElement } from "@/components/message-bus";
import { ensureCustomElement } from "@/components/dynamic-element";
import { ensureCustomIterator } from "@/components/dynamic-element/iterator";
import { showEphemeralMessage } from "@/components/popup";
import { UtilsElement, type Replacer } from "@/components/utils";

declare global {
  var _spy: {};
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

globalThis._spy = {
  intercept(id: string, options?: InterceptionOptions) {
    const receiver = ControlElement.ensure(id);
    const { restoreXMLHttpRequest } = interceptXMLHttpRequest(id, options?.xhrHandlers);
    const { restoreFetch } = interceptFetch(id, options?.fetchHandlers);
    const { restoreSendBeacon } = interceptSendBeacon(id);
    function restore() {
      restoreXMLHttpRequest();
      restoreFetch();
      restoreSendBeacon();
    }
    return {
      receiver,
      restore,
      restoreXMLHttpRequest,
      restoreFetch,
      restoreSendBeacon,
    };
  },
  displaySpyDialog,
  displayStyleDialog,
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
  },
  registerHotStroke,
  getRegisteredHotStrokes,
  getRegisteredHotStroke,
  displayDialog,
  changeHotStrokeSpy(nextStroke: string) {
    const defaultUnregisterHotStroke = unregisterHotStrokeMap.get("spy");
    if (defaultUnregisterHotStroke == null) {
      return;
    }
    defaultUnregisterHotStroke();
    const hotStroke = registerHotStroke(nextStroke, () => {
      displaySpyDialog();
    });
    unregisterHotStrokeMap.set(nextStroke, hotStroke.unregisterHotStroke);
    return hotStroke;
  },
  changeHotStrokeStyle(nextStroke: string) {
    const defaultUnregisterHotStroke = unregisterHotStrokeMap.get("style");
    if (defaultUnregisterHotStroke == null) {
      return;
    }
    defaultUnregisterHotStroke();
    const hotStroke = registerHotStroke(nextStroke, () => {
      displayStyleDialog();
    });
    unregisterHotStrokeMap.set(nextStroke, hotStroke.unregisterHotStroke);
    return hotStroke;
  },
  unregisterHotStrokes() {
    for(const unregisterAHotStroke of unregisterHotStrokeMap.values()) {
      unregisterAHotStroke();
    }
  },
  unregisterHotStroke(stroke: string) {
    getRegisteredHotStroke(stroke)?.unregisterHotStroke();
  },
  ensureCustomElement,
  ensureCustomIterator,
  ensureStore,
  showEphemeralMessage,
  replaceText(replacers: Replacer | Replacer[], selector?: string) {
    UtilsElement.ensure().replaceContent(selector ?? "*", replacers);
  },
};
