import { shadowHostStyle } from "@/components/base/template";
import { EventType } from "@/constants/event-type";
import { createTrustedHtml } from "@/trusted-policy";
import { sleep } from "@/utils";
import { template } from "./template";

const TAG_NAME = "u-spy-popup";

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonPrimitive[] | JsonObject[];
type JsonObject = {
  [key: string]: JsonPrimitive | JsonObject | JsonArray;
};
type Json = JsonPrimitive | JsonArray | JsonObject;

export class PopupElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  id: string = "";
  shadowRoot: ShadowRoot | null = null;
  messageMap: Map<string, Json> = new Map();
  shadowHostStyle: string = shadowHostStyle;
  connectedCallback() {
    const id = `usid-${crypto.randomUUID()}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(
      document
        .createRange()
        .createContextualFragment(
          createTrustedHtml(template({ id, shadowHostStyle })),
        ),
    );
    this.id = id;
    this.shadowRoot = shadowRoot;
  }
  get canRemoveRoot() {
    return this.messageMap.size === 0;
  }
  async addMessage(message: Json, displayMs: number = 1000) {
    if (this.shadowRoot == null) {
      return;
    }
    const TRANSITION_DURATION_MS = 1000;
    const messageId = crypto.randomUUID();
    this.messageMap.set(messageId, message);
    // biome-ignore lint/style/noNonNullAssertion: certainly exists
    const ul = this.shadowRoot.querySelector(`#${this.id}`)!;
    const li = ul.appendChild(document.createElement("li"));
    const textValue =
      typeof message === "string" ? message : JSON.stringify(message, null, 2);
    li.addEventListener(EventType.CLICK, async () => {
      if (li.classList.contains("copied")) {
        return;
      }
      await navigator.clipboard.writeText(textValue);
      li.classList.add("copied");
      await sleep(1000);
      li.classList.remove("copied");
    });
    try {
      li.appendChild(document.createElement("pre")).innerHTML = textValue;
    } catch {
      li.textContent = textValue;
    }
    await new Promise((resolve) => setTimeout(resolve, 1));
    li.classList.add("visible");
    await sleep(TRANSITION_DURATION_MS + displayMs);
    li.classList.remove("visible");
    await sleep(TRANSITION_DURATION_MS);
    li.remove();
    this.messageMap.delete(messageId);
  }
  static ensure() {
    return (
      document.querySelector<PopupElement>(PopupElement.TAG_NAME) ??
      document.body.appendChild<PopupElement>(
        document.createElement(PopupElement.TAG_NAME) as PopupElement,
      )
    );
  }
  static async show(message: Json, displayMs?: number) {
    const popup = PopupElement.ensure();
    await popup.addMessage(message, displayMs);
    if (popup.canRemoveRoot === false) {
      return;
    }
    popup.remove();
  }
}

export function showEphemeralMessage(message: Json, displayMs?: number) {
  PopupElement.show(message, displayMs);
}

try {
  globalThis.customElements.define(TAG_NAME, PopupElement);
} catch {}
