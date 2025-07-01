import { ControlElement } from "@/components/control-element";
import { StoreElement, ensureStore } from "@/components/store";
import { EntryPointElement } from "@/components/entry-point";
import { interceptXMLHttpRequest, type MockXHRHandler } from "@/xml-http-request";
import { interceptFetch, type MockFetchHandler } from "@/fetch";
import { interceptSendBeacon } from "@/beacon";
import { displayDialog } from "@/components/dialog";
import { registerHotStroke } from "@/key-event";
import { MessageBusElement } from "@/components/message-bus";
import { ensureCustomElement } from "@/components/dynamic-element";
import { ensureCustomIterator } from "@/components/dynamic-element/iterator";

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

const unregisterHotStrokeMap = new Map<string, () => void>();

const {
  unregisterHotStroke: unregisterHotStrokeSpy,
} = registerHotStroke("spy", () => {
  displayDialog("spy");
});
unregisterHotStrokeMap.set("spy", unregisterHotStrokeSpy);

const {
  unregisterHotStroke: unregisterHotStrokeStyle,
} = registerHotStroke("style", () => {
  displayDialog("style");
});
unregisterHotStrokeMap.set("style", unregisterHotStrokeStyle);

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
  registerHotStroke,
  displayDialog,
  changeHotStrokeSpy(nextStroke: string) {
    const defaultUnregisterHotStroke = unregisterHotStrokeMap.get("spy");
    if (defaultUnregisterHotStroke == null) {
      return;
    }
    defaultUnregisterHotStroke();
    const hotStroke = registerHotStroke(nextStroke, () => {
      displayDialog("spy");
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
      displayDialog("style");
    });
    unregisterHotStrokeMap.set(nextStroke, hotStroke.unregisterHotStroke);
    return hotStroke;
  },
  unregisterHotStroke() {
    for(const unregisterAHotStroke of unregisterHotStrokeMap.values()) {
      unregisterAHotStroke();
    }
  },
  ensureCustomElement,
  ensureCustomIterator,
  ensureStore,
};
