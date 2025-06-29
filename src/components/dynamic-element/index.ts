export function ensureCustomTemplate(templateId: string, templateHtml: string) {
  document.body.appendChild(
    document
      .createRange()
      .createContextualFragment(
        `<template id="${templateId}">${templateHtml}</template>`
      )
  );
}

function getVariableNames(node: HTMLElement) {
  const variableNames: string[] = [];
  for (const el of Array.from(node.querySelectorAll("[\\:value]"))) {
    const variableName = el.getAttribute(":value");
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
    eventHandlers,
  }: {
    templateId?: string;
    templateHtml?: string;
    eventHandlers?: Record<string, (e: any) => void>;
  },
) {
  if (customElements.get(tagName) != null) {
    return;
  }
  if (templateId == null && templateHtml == null) {
    console.warn("templateId or templateHtml is necessary");
    return;
  }
  const localEventHanders = eventHandlers ?? {};
  const localTemplateId = templateId ?? `template-${crypto.randomUUID()}`;
  if (templateId == null && templateHtml != null) {
    ensureCustomTemplate(localTemplateId, templateHtml);
  }
  const template = document.querySelector<HTMLTemplateElement>(`#${localTemplateId}`);
  if (template == null) {
    return;
  }
  const variableNames = Array.from(template.content.children)
    .reduce((variableNames, node) => [
      ...variableNames,
      ...getVariableNames(node as HTMLElement)
    ], [] as string[]);
  customElements.define(tagName, class extends HTMLElement {
    static get observedAttributes() {
      return [
        "item",
        ...variableNames,
      ];
    }
    shadowRoot: ShadowRoot;
    boundData: Record<string, any>;
    constructor() {
      super();
      const that = this;
      this.shadowRoot = this.attachShadow({ mode: "closed" });
      const clonedNode = template?.content.cloneNode(true);
      if (clonedNode != null) {
        this.shadowRoot.appendChild(clonedNode);
      }
      for(const el of Array.from(this.shadowRoot.querySelectorAll("*"))) {
        const handledEventNames = el.getAttributeNames()
          .filter(attributeName => /^@/.test(attributeName))
          .map(attributeName => attributeName.replace(/^@/, ""));
        for(const handledEventName of handledEventNames) {
          const handlerName = el.getAttribute(`@${handledEventName}`);
          if (handlerName == null || handlerName in localEventHanders === false) {
            continue;
          }
          el.addEventListener(handledEventName, localEventHanders[handlerName]);
        }
      }
      const data = Object.fromEntries(
        variableNames.map(prop => [
          prop,
          this.shadowRoot.host.getAttribute(prop),
        ])
      );
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
    get item() {
      return this.boundData;
    }
    set item(value) {
      for(const variableName of variableNames) {
        if (variableName in value === false) {
          continue;
        }
        this.boundData[variableName] = value[variableName];
      }
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === "item") {
        const item = (() => {
          try {
            return JSON.parse(newValue);
          } catch {
            return null;
          }
        })();
        if (item == null) {
          return;
        }
        this.item = item;
        return;
      }
      this.shadowRoot.querySelectorAll(`[\\:value='${name}']`).forEach(el => {
        el.textContent = newValue;
      });
    }
  });
}
