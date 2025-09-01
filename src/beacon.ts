import { ControlElement } from "@/components/control-element";

export function interceptSendBeacon(id: string) {
  const originalSendBeacon = globalThis.navigator.sendBeacon;
  globalThis.navigator.sendBeacon = (
    url: string | URL,
    data?: BodyInit | null,
  ) => {
    ControlElement.ensure(id).dispatchBeacon({ url, data });
    return originalSendBeacon.apply(globalThis.navigator, [url, data]);
  };

  return {
    restoreSendBeacon() {
      globalThis.navigator.sendBeacon = originalSendBeacon;
    },
  };
}
