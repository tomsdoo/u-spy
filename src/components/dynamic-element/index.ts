export function ensureCustomTemplate(templateId: string, templateHtml: string) {
  document.body.appendChild(document.createRange().createContextualFragment(`<template id="${templateId}">
    ${templateHtml}
  </template>`));
}

function getVariableNames(node: HTMLElement) {
  const variableNames: string[] = [];
  for (const el of Array.from(node.querySelectorAll("[data-value]"))) {
    const variableName = el.getAttribute("data-value");
    if (variableName == null) {
      continue;
    }
    variableNames.push(variableName);
  }
  return variableNames;
}

export function ensureCustomElement(
  tagName: string,
  {
    templateId,
    templateHtml,
  }: {
    templateId?: string;
    templateHtml?: string;
  },
) {
  if (customElements.get(tagName) != null) {
    return;
  }
  if (templateId == null && templateHtml == null) {
    console.warn("templateId or templateHtml is necessary");
    return;
  }
  const localTemplateId = templateId ?? `template-${crypto.randomUUID()}`;
  if (templateId == null && templateHtml != null) {
    ensureCustomTemplate(localTemplateId, templateHtml);
  }
  const template = document.querySelector<HTMLTemplateElement>(`#${localTemplateId}`);
  if (template == null) {
    return;
  }
  const variableNames = Array.from(template.content.children)
    .reduce((variableNames, node) => [...variableNames, ...getVariableNames(node as HTMLElement)], [] as string[]);
  customElements.define(tagName, class extends HTMLElement {
    static get observedAttributes() {
      return variableNames;
    }
    shadowRoot: ShadowRoot;
    boundData: Record<string, any>;
    constructor() {
      super();
      this.shadowRoot = this.attachShadow({ mode: "closed" });
      const clonedNode = template?.content.cloneNode(true);
      if (clonedNode != null) {
        for (const el of Array.from((clonedNode as HTMLElement).querySelectorAll("[data-value]"))) {
          const dataName = el.getAttribute("data-value");
          if (dataName == null) {
            continue;
          }
          el.setAttribute("data-name", dataName);
        }
        this.shadowRoot.appendChild(clonedNode);
      }
      const data = Object.fromEntries(
        variableNames.map(prop => [
          prop,
          this.shadowRoot.host.getAttribute(prop),
        ])
      );
      const that = this;
      this.boundData = new Proxy(data, {
        get(target, prop, receiver) {
          return typeof prop === "string"
            ? that.shadowRoot.host.getAttribute(prop)
            : Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
          if (typeof prop === "symbol") {
            return true;
          }
          that.shadowRoot.host.setAttribute(prop, value);;
          target[prop] = value;
          return true;
        },
      });
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.shadowRoot.querySelectorAll(`[data-name='${name}']`).forEach(el => {
        el.textContent = newValue;
      });
    }
  });
}
