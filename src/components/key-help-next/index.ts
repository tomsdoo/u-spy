import { BaseElement } from "@/components/base";
import { template } from "./template";

const TAG_NAME = "u-spy-key-help";

export class KeyHelpElement extends BaseElement {
  id: string;
  keyDefinitions: string;
  static get observedAttributes() {
    return [":key-definitions"];
  }
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `uskh-${crypto.randomUUID()}`;
    this.keyDefinitions = "[]";
  }
  get keyDefinitionItems() {
    try {
      return JSON.parse(this.keyDefinitions);
    } catch {
      return [];
    }
  }
  connectedCallback() {
    this.render();
  }
}

try {
  globalThis.customElements.define(TAG_NAME, KeyHelpElement);
} catch {}
