import { ControlElement } from "@/components/control-element";
import { appendEntryPoint } from "@/components/entry-point";
import { interceptXMLHttpRequest } from "@/xml-http-request";
import { interceptFetch } from "@/fetch";

declare global {
  var _easySpy: {};
}

appendEntryPoint();

globalThis._easySpy = {
  intercept(id: string) {
    const receiver = ControlElement.ensure(id);
    const { restoreXMLHttpRequest } = interceptXMLHttpRequest(id);
    const { restoreFetch } = interceptFetch(id);
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
