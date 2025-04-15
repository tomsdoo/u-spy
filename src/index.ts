import { ControlElement } from "@/components/control-element";
import { appendEntryPoint } from "@/components/entry-point";
import { interceptXMLHttpRequest, type MockXHRHandler } from "@/xml-http-request";
import { interceptFetch, type MockFetchHandler } from "@/fetch";

declare global {
  var _spy: {};
}

interface InterceptionOptions {
  fetchHandlers?: MockFetchHandler[];
  xhrHandlers?: MockXHRHandler[];
}

appendEntryPoint();

globalThis._spy = {
  intercept(id: string, options?: InterceptionOptions) {
    const receiver = ControlElement.ensure(id);
    const { restoreXMLHttpRequest } = interceptXMLHttpRequest(id, options?.xhrHandlers);
    const { restoreFetch } = interceptFetch(id, options?.fetchHandlers);
    function restore() {
      restoreXMLHttpRequest();
      restoreFetch();
    }
    return {
      receiver,
      restore,
      restoreXMLHttpRequest,
      restoreFetch,
    };
  },
};
