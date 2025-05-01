import { ControlElement } from "@/components/control-element";

export type MockFetchHandler = (input: RequestInfo | URL, init?: RequestInit, originalFetch?: typeof global["fetch"]) => Promise<Response | null | undefined>;

export function interceptFetch(id: string, mockHandlers?: MockFetchHandler[]) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await (async () => {
      for(const mockHandler of mockHandlers ?? []) {
        const response = await mockHandler(input, init, originalFetch);
        if (response != null) {
          return response;
        }
      }
      return await originalFetch(input, init);
    })();
    const alternativeResponse = response.clone();
    ControlElement.ensure(id).dispatchFetch({
      input,
      init,
      response: alternativeResponse,
    });
    return response;
  };

  return {
    restoreFetch() {
      globalThis.fetch = originalFetch;
    },
  };
}
