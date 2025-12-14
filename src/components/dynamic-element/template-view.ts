import { applyIfNotEqual } from "@/components/dynamic-element//apply-if-not-equal";
import { addClasses } from "@/components/dynamic-element/add-classes";
import { applyIf } from "@/components/dynamic-element/apply-if";
import { applyIfEqual } from "@/components/dynamic-element/apply-if-equal";
import { applyIfNot } from "@/components/dynamic-element/apply-if-not";
import { embedSrc } from "@/components/dynamic-element/embed-src";
import { embedTextContent } from "@/components/dynamic-element/embed-text-content";
import { embedValue } from "@/components/dynamic-element/embed-value";
import { combineSimpleReducers } from "@/components/dynamic-element/reducers";
import { registerEventHandlers } from "@/components/dynamic-element/register-event-handlers";
import { deflate, pickPropertyFromDeflatedItem } from "@/utils/deflate";

function createEventHandlersProxy(
  handlers: Record<
    string,
    (
      e: Event,
      item?: ReturnType<typeof deflate>,
      wholeItem?: unknown,
      reflux?: (nextItem: unknown) => void,
    ) => void
  >,
  onChanged: (prop: string) => void,
) {
  return new Proxy(handlers, {
    set(target, prop, value) {
      if (typeof value !== "function") {
        throw new Error("event handler must be a function");
      }
      target[String(prop)] = value;
      onChanged(String(prop));
      return true;
    },
  });
}

export function ensureTemplateView(customTagName?: string) {
  const localTagName = customTagName ?? "template-view";
  if (customElements.get(localTagName)) {
    return;
  }

  customElements.define(
    localTagName,
    class extends HTMLElement {
      static get observedAttributes() {
        return ["item"];
      }
      isTemplateReady: boolean;
      isRefreshRequired: boolean;
      contentTags: Node[];
      _eventHandlers: Record<
        string,
        (
          e: Event,
          item?: ReturnType<typeof deflate>,
          wholeItem?: unknown,
          reflux?: (nextItem: unknown) => void,
        ) => void
      >;
      _reducers: Array<(value: unknown) => unknown>;
      _onRenderedCallback:
        | ((p: { shadowRoot: ShadowRoot | null; item: unknown }) => void)
        | null = null;
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.isTemplateReady = false;
        this.contentTags = [];
        this._eventHandlers = createEventHandlersProxy({}, () => {
          this.isRefreshRequired = true;
          this.render();
        });
        this._reducers = [];
        this.isRefreshRequired = true;
      }
      get eventHandlers() {
        return this._eventHandlers;
      }
      set eventHandlers(v) {
        this._eventHandlers = createEventHandlersProxy(v, () => {
          this.isRefreshRequired = true;
          this.render();
        });
        this.isRefreshRequired = true;
        this.render();
      }
      get reducers() {
        return this._reducers;
      }
      set reducers(v) {
        this._reducers = v;
        this.isRefreshRequired = true;
        this.render();
      }
      get item() {
        try {
          const itemStr = this.getAttribute("item");
          if (itemStr == null) {
            return {};
          }
          return JSON.parse(itemStr);
        } catch {
          return {};
        }
      }
      set item(v) {
        if (JSON.stringify(v) === JSON.stringify(this.item)) {
          return;
        }
        this.isRefreshRequired = true;
        this.setAttribute("item", JSON.stringify(v));
      }
      getReadyTemplate() {
        if (this.isTemplateReady === false) {
          this.contentTags = Array.from(this.querySelectorAll("*"))
            .filter(({ parentElement }) => parentElement === this)
            .map((contentTag) => {
              const clonedTag = contentTag.cloneNode(true);
              contentTag.remove();
              return clonedTag;
            });
        }
        for (const childNode of Array.from(this.shadowRoot?.childNodes ?? [])) {
          childNode.remove();
        }
        for (const contentTag of this.contentTags) {
          this.shadowRoot?.appendChild(contentTag.cloneNode(true));
        }
        this.isTemplateReady = true;
      }
      render() {
        this.getReadyTemplate();
        if (this.isRefreshRequired !== true) {
          return;
        }
        const wholeItem = combineSimpleReducers(this.reducers)(this.item);
        const deflatedItem = deflate(wholeItem);
        const instance = this;
        (function embed(node: Node | null, item: ReturnType<typeof deflate>) {
          if (node == null) {
            return;
          }

          const isRemoved =
            applyIf(node, item) ||
            applyIfNot(node, item) ||
            applyIfEqual(node, item) ||
            applyIfNotEqual(node, item);
          if (isRemoved) {
            return;
          }

          registerEventHandlers(
            node,
            item,
            instance.eventHandlers,
            wholeItem,
            (nextItem) => {
              instance.item = nextItem;
            },
          );

          addClasses(node, item);

          embedValue(node, item);
          embedSrc(node, item);

          const isProcessedTextContent = embedTextContent(node, item);
          if (isProcessedTextContent) {
            return;
          }

          for (const childNode of Array.from(node.childNodes)) {
            if (childNode instanceof HTMLElement === false) {
              continue;
            }
            if (childNode.hasAttribute(":for")) {
              const propName = childNode.getAttribute(":for");
              if (propName == null) {
                continue;
              }
              const childItems = pickPropertyFromDeflatedItem(item, propName);
              if (Array.isArray(childItems) === false) {
                childNode.remove();
                continue;
              }
              for (const childItem of childItems) {
                const addedNode = childNode.parentNode?.insertBefore(
                  childNode.cloneNode(true),
                  childNode,
                );
                const deflatedChildItem = deflate(childItem);
                embed(addedNode ?? null, deflatedChildItem);
              }
              childNode.remove();
              continue;
            }
            embed(childNode, item);
          }
        })(this.shadowRoot, deflatedItem);
        this.isRefreshRequired = false;

        if (this._onRenderedCallback != null) {
          this._onRenderedCallback({
            shadowRoot: this.shadowRoot,
            item: this.item,
          });
        }
      }
      connectedCallback() {
        this.render();
      }
      attributeChangedCallback(
        name: string,
        _ondValue: string,
        newValue: string,
      ) {
        if (name !== "item") {
          return;
        }
        this.item = (() => {
          try {
            return JSON.parse(newValue);
          } catch {
            return {};
          }
        })();
        this.render();
      }
      onRendered(
        callback: (p: { shadowRoot: ShadowRoot | null; item: unknown }) => void,
      ) {
        this._onRenderedCallback = callback;
        this.isRefreshRequired = true;
        this.render();
      }
    },
  );
}
