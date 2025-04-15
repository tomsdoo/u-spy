import { ControlElement } from "@/components/control-element";

export type MockXHRHandler = (p: {
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  user?: string | null;
  password?: string | null;
  body?: Document | XMLHttpRequestBodyInit | null;
}) => Promise<{
  response: any;
  status: number;
  responseHeaders: Record<string, string>;
  responseURL: string;
  responseText: string;
  responseXML: Document | null;
} | null>;

function getXMLHttpRequestClassDefinition(id: string, handlers?: MockXHRHandler[]) {
  return class extends XMLHttpRequest {
    requestMethod: string = "";
    requestUrl: string = "";
    requestUser: string | null | undefined = null;
    requestPassword: string | null | undefined = null;
    requestBody: Document | XMLHttpRequestBodyInit | null = null;
    requestHeaders: Record<string, string> = {};
    responseHeaders: Record<string, string> = {};
    eventListeners: Map<any, any> = new Map();
    open(method: string, url: string, async?: boolean, user?: string, password?: string): void {
      this.requestMethod = method;
      this.requestUrl = url;
      this.requestUser = user;
      this.requestPassword = password;
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
  addEventListener(type: any, listener: any) {
    const listeners = this.eventListeners.get(type) ?? [];
    this.eventListeners.set(type, [
      ...listeners,
      listener,
    ]);
    super.addEventListener(type, listener);
  }
   send(body?: Document | XMLHttpRequestBodyInit | null): void {
      this.requestBody = body ?? null;
      const params = {
        method: this.requestMethod,
        url: this.requestUrl,
        requestHeaders: this.requestHeaders,
        user: this.requestUser,
        password: this.requestPassword,
        body: this.requestBody,
      };
      const that = this;
      const originalSend = super.send;
      Promise.all(
        (handlers ?? []).map(mockHandler => mockHandler(params))
      )
        .then(results => {
          const result = results.find(result => result != null);
          if (result == null) {
            originalSend(body);
            return;
          }
          Object.defineProperty(that, "readyState", { value: 4, writable: false });
          Object.defineProperty(that, "status", { value: result.status, writable: false });
          Object.defineProperty(that, "responseText", { value: result.responseText, writable: false });
          Object.defineProperty(that, "responseXML", { value: result.responseXML, writable: false });
          Object.defineProperty(that, "responseURL", { value: result.responseURL, writable: false });
          Object.defineProperty(that, "responseHeaders", { value: result.responseHeaders, writable: false });
          Object.defineProperty(that, "response", { value: result.response, writable: false });

          ["load", "readystatechange"].forEach((type) => {
            for(const listener of that.eventListeners.get(type) ?? []) {
              listener.call(that);
            }
          });

          if (typeof that.onload === "function") {
            that.onload();
          }
          if (typeof that.onreadystatechange === "function") {
            that.onreadystatechange();
          }
        });
    }
  }
}

export function interceptXMLHttpRequest(id: string, handlers?: MockXHRHandler[]) {
  const originalXMLHttpRequest = globalThis.XMLHttpRequest;
  globalThis.XMLHttpRequest = getXMLHttpRequestClassDefinition(id, handlers);
  return {
    restoreXMLHttpRequest() {
      globalThis.XMLHttpRequest = originalXMLHttpRequest;
    },
  };
}
