import { ControlElement } from "@/components/control-element";

export function interceptWindowMessage(id: string) {
  function dispatchMessage(e: MessageEvent) {
    ControlElement.ensure(id).dispatchWindowMessage({
      data: e.data,
      origin: e.origin,
      lastEventId: e.lastEventId,
    });
  }
  window.addEventListener("message", dispatchMessage);
  return {
    restoreInterceptWindowMessage() {
      window.removeEventListener("message", dispatchMessage);
    },
  };
}
