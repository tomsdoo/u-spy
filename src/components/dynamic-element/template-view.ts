import { embedValue } from "@/components/dynamic-element/embed-value";
import { combineSimpleReducers } from "@/components/dynamic-element/reducers";
import { deflate } from "@/utils/deflate";

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

          if (node instanceof HTMLElement) {
            const handledEventNames = node
              .getAttributeNames()
              .filter((attributeName) => /^@/.test(attributeName))
              .map((attributeName) => attributeName.replace(/^@/, ""));
            for (const handledEventName of handledEventNames) {
              const handlerName = node.getAttribute(`@${handledEventName}`);
              if (
                handlerName == null ||
                handlerName in instance.eventHandlers === false
              ) {
                continue;
              }
              node.addEventListener(handledEventName, (e) => {
                instance.eventHandlers[handlerName](
                  e,
                  item,
                  wholeItem,
                  (nextItem) => {
                    instance.item = nextItem;
                  },
                );
              });
            }
          }

          if (node instanceof HTMLElement && node.hasAttribute(":if")) {
            const propName = node.getAttribute(":if");
            if (propName == null) {
              return;
            }
            const embeddingValue = item[propName];
            // truthy check
            if (!embeddingValue) {
              node.remove();
              return;
            }
          }

          embedValue(node, item);

          if (node instanceof HTMLElement && node.hasAttribute(":text")) {
            const propName = node.getAttribute(":text");
            if (propName == null) {
              return;
            }
            if (propName === ".") {
              node.textContent = String(item);
              return;
            }
            if (propName in item === false) {
              node.textContent = "";
              return;
            }
            const embeddingValue = item[propName];
            node.textContent = String(embeddingValue);
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
              if (Array.isArray(item[propName]) === false) {
                childNode.remove();
                continue;
              }
              for (const childItem of item[propName]) {
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
    },
  );
}
