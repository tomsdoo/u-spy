import { template } from "./template";

const TAG_NAME = "u-spy-key-help";

export class KeyHelpElement extends HTMLElement {
  id: string = "";
  shadowRoot: ShadowRoot | null = null;
  observer: MutationObserver | null = null;
  static TAG_NAME = TAG_NAME;
  connectedCallback() {
    const id = `u-spy-key-help-${crypto.randomUUID().replace(/-/g, "")}`;
    this.id = id;
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot = shadowRoot;
    this.shadowRoot?.appendChild(
      document.createRange().createContextualFragment(template(id)),
    );
    this.observe();
  }
  observe() {
    if (this.shadowRoot == null) {
      return;
    }
    this.observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type !== "attributes") {
          continue;
        }

        if (mutation.attributeName == null) {
          continue;
        }

        switch (mutation.attributeName) {
          case "visible": {
            if (this.id === "") {
              break;
            }
            if (
              (mutation.target as HTMLElement).getAttribute("visible") ===
              "true"
            ) {
              this.shadowRoot
                ?.querySelector(`#${this.id}`)
                ?.classList.remove("hidden");
            } else {
              this.shadowRoot
                ?.querySelector(`#${this.id}`)
                ?.classList.add("hidden");
            }
            break;
          }
          case "key-definitions": {
            if (this.id === "") {
              break;
            }
            const ul = this.shadowRoot?.querySelector(`#${this.id} > ul`);
            if (ul == null) {
              break;
            }
            const attributeValue = (
              mutation.target as HTMLElement
            ).getAttribute("key-definitions");
            if (attributeValue == null) {
              break;
            }
            const keyDefinitions = ((): {
              key: string;
              description: string;
            }[] => {
              try {
                return JSON.parse(attributeValue);
              } catch {
                return [];
              }
            })();
            ul.innerHTML = "";
            for (const { key, description } of keyDefinitions) {
              const li = ul.appendChild(document.createElement("li"));
              li.appendChild(document.createElement("div")).textContent = key;
              li.appendChild(document.createElement("div")).textContent =
                description;
            }
          }
        }
      }
    });
    this.observer.observe(this.shadowRoot.host, { attributes: true });
  }
  disconnectedCallback() {
    if (this.observer == null) {
      return;
    }

    this.observer.disconnect();
  }
}

try {
  globalThis.customElements.define(TAG_NAME, KeyHelpElement);
} catch {}
