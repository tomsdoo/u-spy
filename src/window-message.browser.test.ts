import { describe, expect, it, vi } from "vitest";
import { ControlElement } from "@/components/control-element";
import { interceptWindowMessage } from "@/window-message";

describe("interceptWindowMessage", () => {
  it("ok", async () => {
    const spyControlElementEnsure = vi.spyOn(ControlElement, "ensure");
    const spyControlElementDispatchWindowMessage = vi.spyOn(
      ControlElement.prototype,
      "dispatchWindowMessage",
    );
    const { restoreInterceptWindowMessage } =
      interceptWindowMessage("control-id");
    window.dispatchEvent(new MessageEvent("message", { data: { value: 1 } }));
    expect(spyControlElementEnsure).toHaveBeenCalledTimes(1);
    expect(spyControlElementDispatchWindowMessage).toHaveBeenCalledTimes(1);

    restoreInterceptWindowMessage();

    window.dispatchEvent(new MessageEvent("message", { data: { value: 1 } }));
    expect(spyControlElementEnsure).toHaveBeenCalledTimes(1);
    expect(spyControlElementDispatchWindowMessage).toHaveBeenCalledTimes(1);
  });
});
