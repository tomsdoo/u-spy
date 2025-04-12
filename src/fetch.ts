import { ControlElement } from "@/components/control-element";

export function interceptFetch(id: string) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await originalFetch(input, init);
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
