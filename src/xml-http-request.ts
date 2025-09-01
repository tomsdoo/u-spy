import { ControlElement } from "@/components/control-element";

export type MockXHRHandler = (
  p: {
    method: string;
    url: string;
    requestHeaders: Record<string, string>;
    user?: string | null;
    password?: string | null;
    body?: Document | XMLHttpRequestBodyInit | null;
  },
  originalXMLHttpRequest: (typeof global)["XMLHttpRequest"],
) => Promise<{
  // biome-ignore lint/suspicious/noExplicitAny: accept any
  response: any;
  status: number;
  responseHeaders: Record<string, string>;
  responseURL: string;
  responseText: string;
  responseXML: Document | null;
} | null>;

class SpiedXMLHttpRequestBase extends XMLHttpRequest {
  static isUSpy = true;
  requestMethod: string = "";
  requestUrl: string = "";
  requestUser: string | null | undefined = null;
  requestPassword: string | null | undefined = null;
  requestBody: Document | XMLHttpRequestBodyInit | null = null;
  requestHeaders: Record<string, string> = {};
  responseHeaders: Record<string, string> = {};
  // biome-ignore lint/suspicious/noExplicitAny: accept any
  eventListeners: Map<any, any> = new Map();
  open(
    method: string,
    url: string,
    async?: boolean,
    user?: string,
    password?: string,
  ): void {
    this.requestMethod = method;
    this.requestUrl = url;
    this.requestUser = user;
    this.requestPassword = password;
    super.open(method, url, async ?? true, user, password);
    super.addEventListener("readystatechange", (_e) => {
      if (this.readyState !== this.HEADERS_RECEIVED) {
        return;
      }
      this.responseHeaders = Object.fromEntries(
        this.getAllResponseHeaders()
          .trim()
          .split(/[\r\n]+/)
          .map((line) => line.split(": "))
          .map(([Header, ...valueArr]) => [Header, valueArr.join(": ")]),
      );
    });
  }
  setRequestHeader(name: string, value: string): void {
    this.requestHeaders[name] = value;
    super.setRequestHeader(name, value);
  }
  // biome-ignore lint/suspicious/noExplicitAny: accept any
  addEventListener(type: any, listener: any) {
    const listeners = this.eventListeners.get(type) ?? [];
    this.eventListeners.set(type, [...listeners, listener]);
    super.addEventListener(type, listener);
  }
  send(body?: Document | XMLHttpRequestBodyInit | null): void {
    this.requestBody = body ?? null;
    super.send(body);
  }
}

function getXMLHttpRequestClassDefinition(
  id: string,
  handlers: MockXHRHandler[],
  originalXmlHttpRequest: (typeof global)["XMLHttpRequest"],
) {
  return class SpiedXMLHttpRequest extends SpiedXMLHttpRequestBase {
    open(
      method: string,
      url: string,
      async?: boolean,
      user?: string,
      password?: string,
    ): void {
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
    }
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
      const params = {
        method: this.requestMethod,
        url: this.requestUrl,
        requestHeaders: this.requestHeaders,
        user: this.requestUser,
        password: this.requestPassword,
        body: this.requestBody,
      };
      const originalSend = super.send;
      Promise.all(
        (handlers ?? []).map((mockHandler) =>
          mockHandler(params, originalXmlHttpRequest),
        ),
      ).then((results) => {
        const result = results.find((result) => result != null);
        if (result == null) {
          originalSend.call(this, body);
          return;
        }
        Object.defineProperty(this, "readyState", {
          value: 4,
          writable: false,
        });
        Object.defineProperty(this, "status", {
          value: result.status,
          writable: false,
        });
        Object.defineProperty(this, "responseText", {
          value: result.responseText,
          writable: false,
        });
        Object.defineProperty(this, "responseXML", {
          value: result.responseXML,
          writable: false,
        });
        Object.defineProperty(this, "responseURL", {
          value: result.responseURL,
          writable: false,
        });
        Object.defineProperty(this, "responseHeaders", {
          value: result.responseHeaders,
          writable: false,
        });
        Object.defineProperty(this, "response", {
          value: result.response,
          writable: false,
        });

        ["load", "readystatechange"].forEach((type) => {
          for (const listener of this.eventListeners.get(type) ?? []) {
            listener.call(this, {
              ...this,
              target: this,
            });
          }
        });

        if (typeof this.onload === "function") {
          this.onload({
            ...this,
            target: this,
          });
        }
        if (typeof this.onreadystatechange === "function") {
          this.onreadystatechange({
            ...this,
            target: this,
          });
        }
      });
    }
  };
}

export function interceptXMLHttpRequest(
  id: string,
  handlers?: MockXHRHandler[],
) {
  const originalXMLHttpRequest = globalThis.XMLHttpRequest;
  globalThis.XMLHttpRequest = getXMLHttpRequestClassDefinition(
    id,
    handlers ?? [],
    originalXMLHttpRequest,
  );
  return {
    restoreXMLHttpRequest() {
      globalThis.XMLHttpRequest = originalXMLHttpRequest;
    },
  };
}
