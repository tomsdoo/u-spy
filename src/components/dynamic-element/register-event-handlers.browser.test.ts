import { describe, expect, it, vi } from "vitest";
import { registerEventHandlers } from "./register-event-handlers";

describe("registerEventHandlers", () => {
  it("should register event handlers on the element", () => {
    document.body.innerHTML = `<div id="test-element" @click="click" @mouseover="mouseover"></div>`;
    const element = document.querySelector("#test-element");

    const clickHandler = vi.fn();
    const mouseOverHandler = vi.fn();

    const eventHandlers = {
      click: clickHandler,
      mouseover: mouseOverHandler,
    };

    expect(element).not.toBeNull();
    if (element != null) {
      registerEventHandlers(element, {}, eventHandlers, {}, () => {});
      const clickEvent = new Event("click");
      (element as HTMLElement).dispatchEvent(clickEvent);
      expect(clickHandler).toHaveBeenCalledTimes(1);

      const mouseOverEvent = new Event("mouseover");
      (element as HTMLElement).dispatchEvent(mouseOverEvent);
      expect(mouseOverHandler).toHaveBeenCalledTimes(1);
    }
  });

  it("should not register handlers for unknown events", () => {
    document.body.innerHTML = `<div id="test-element" @click="click" @mouseover="mouseover"></div>`;
    const element = document.querySelector("#test-element");

    const clickHandler = vi.fn();
    const mouseOverHandler = vi.fn();

    const eventHandlers = {
      click: clickHandler,
    };

    expect(element).not.toBeNull();
    if (element != null) {
      registerEventHandlers(element, {}, eventHandlers, {}, () => {});
      const mouseOverEvent = new Event("mouseover");
      (element as HTMLElement).dispatchEvent(mouseOverEvent);
      expect(mouseOverHandler).toHaveBeenCalledTimes(0);
    }
  });
});
