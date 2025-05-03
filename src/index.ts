import { ControlElement } from "@/components/control-element";
import { StoreElement } from "@/components/store";
import { appendEntryPoint } from "@/components/entry-point";
import { interceptXMLHttpRequest, type MockXHRHandler } from "@/xml-http-request";
import { interceptFetch, type MockFetchHandler } from "@/fetch";
import { interceptSendBeacon } from "@/beacon";
import { displayDialog } from "@/components/dialog";
import { registerHotStroke } from "@/key-event";

declare global {
  var _spy: {};
}

interface InterceptionOptions {
  fetchHandlers?: MockFetchHandler[];
  xhrHandlers?: MockXHRHandler[];
}

appendEntryPoint();
StoreElement.ensure();

const {
  unregisterHotStroke,
} = registerHotStroke("spy", displayDialog);

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
  unregisterHotStroke,
};
