import { ControlElement } from "@/components/control-element";

function getXMLHttpRequestClassDefinition(id: string) {
  return class extends XMLHttpRequest {
    requestBody: Document | XMLHttpRequestBodyInit | null = null;
    requestHeaders: Record<string, string> = {};
    responseHeaders: Record<string, string> = {};
    open(method: string, url: string, async?: boolean, user?: string, password?: string): void {
      super.open(method, url, async ?? true, user, password);
      super.addEventListener("load", (e) => {
        if (e.target == null) {
          return;
        }
        ControlElement.ensure(id).dispatchXhrLoad({
          method,
          url,
          requestHeaders: this.requestHeaders,
          requestBody: this.requestBody,
          response: this.response,
          status: this.status,
          responseHeaders: this.responseHeaders,
          responseType: this.responseType,
          responseURL: this.responseURL,
          readyState: this.readyState,
          responseText: this.responseText,
          responseXML: this.responseXML,
        });
      });
      super.addEventListener("readystatechange", (e) => {
        if (this.readyState !== this.HEADERS_RECEIVED) {
          return;
        }
        this.responseHeaders = Object.fromEntries(
          this.getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/)
            .map((line) => line.split(": "))
            .map(([Header, ...valueArr]) => [Header, valueArr.join(": ")])  
        );
      });
    }
    setRequestHeader(name: string, value: string): void {
      this.requestHeaders[name] = value;
      super.setRequestHeader(name, value);
    }
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
      this.requestBody = body ?? null;
      super.send(body);
    }
  }
}

export function interceptXMLHttpRequest(id: string) {
  const originalXMLHttpRequest = globalThis.XMLHttpRequest;
  globalThis.XMLHttpRequest = getXMLHttpRequestClassDefinition(id);
  return {
    restoreXMLHttpRequest() {
      globalThis.XMLHttpRequest = originalXMLHttpRequest;
    },
  };
}
