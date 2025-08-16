import { describe, it, expect, vi } from "vitest";
import { interceptWindowMessage } from "@/window-message";
import { ControlElement } from "@/components/control-element";

describe("interceptWindowMessage", () => {
  it("ok", async () => {
    const spyControlElementEnsure = vi.spyOn(ControlElement, "ensure");
    const spyControlElementDispatchWindowMessage = vi.spyOn(ControlElement.prototype, "dispatchWindowMessage");
    const {
      restoreInterceptWindowMessage,
    } = interceptWindowMessage("control-id");
    window.dispatchEvent(new MessageEvent("message", { data: { value: 1 }}))
    expect(spyControlElementEnsure).toHaveBeenCalledTimes(1);
    expect(spyControlElementDispatchWindowMessage).toHaveBeenCalledTimes(1);

    restoreInterceptWindowMessage();

    window.dispatchEvent(new MessageEvent("message", { data: { value: 1 }}))
    expect(spyControlElementEnsure).toHaveBeenCalledTimes(1);
    expect(spyControlElementDispatchWindowMessage).toHaveBeenCalledTimes(1);
  });
});

