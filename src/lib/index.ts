import {
  getRegisteredHotStroke,
  getRegisteredHotStrokes,
  registerHotStroke,
} from "@/key-event";
import { interceptXMLHttpRequestWithoutControlElement } from "@/xml-http-request";
import { interceptFetch } from "@/fetch";

export { createEventBus } from "@/event-bus";
export { createFreeContainer } from "@/free-container";
export { download } from "@/utils/download";
export { replaceContent } from "@/utils/replace-content";
export { sleep } from "@/utils/sleep";
export { ensureTemplateView } from "@/components/dynamic-element/template-view";
export const hotStroke = {
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
};

export function interceptNetworkRequests({
  fetchHandlers,
  XHRHandlers,
}: {
  fetchHandlers?: Parameters<typeof interceptFetch>[1],
  XHRHandlers?: Parameters<typeof interceptXMLHttpRequestWithoutControlElement>[0],
}) {
  const nop = () => {};
  const fetchInterceptor = fetchHandlers ? interceptFetch("ignored-id", fetchHandlers, true) : {
    restoreFetch: nop,
  };
  const xhrInterceptor = XHRHandlers ? interceptXMLHttpRequestWithoutControlElement(XHRHandlers) : {
    restoreXMLHttpRequest: nop,
  };
  return {
    restore() {
      fetchInterceptor.restoreFetch();
      xhrInterceptor.restoreXMLHttpRequest();
    },
  };
}
