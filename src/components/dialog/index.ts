import { template } from "./template";
import { ControlElement } from "@/components/control-element";
import { LogListElement } from "@/components/log/list";
import { EventType } from "@/constants/event-type";
import { KeyHelpElement } from "@/components/key-help";
import { StoreElement } from "@/components/store";

const TAG_NAME = "u-spy-dialog";

function ref<T = unknown>(initialValue: T) {
  return new Proxy({
    value: initialValue,
  }, {
    set(target, prop, value) {
      if (prop === "value") {
        target[prop] = value;
      }
      return true;
    },
  });
}

export class DialogElement extends HTMLElement {
  id: string;
  articleId: string;
  contentId: string;
  dialogId: string;
  controlListId: string;
  store: StoreElement = StoreElement.ensure();
  keyEventHandler: ((e: KeyboardEvent) => void) | null = null;
  constructor() {
    super();
    this.id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    this.articleId = `usa-${crypto.randomUUID().replace(/-/g, "")}`;
    this.contentId = `usc-${crypto.randomUUID().replace(/-/g, "")}`;
    this.dialogId = `usd-${crypto.randomUUID().replace(/-/g, "")}`;
    this.controlListId = `uscl-${crypto.randomUUID().replace(/-/g, "")}`;
  }
  get ids() {
    return {
      articleId: this.articleId,
      contentId: this.contentId,
      controlListId: this.controlListId,
    };
  }
  get Selectors() {
    return {
      ARTICLE: `#${this.articleId}`,
      CONTENT: `#${this.contentId}`,
      DIALOG: `${KeyHelpElement.TAG_NAME}`,
      CONTROL_LIST: `#${this.controlListId}`,
    };
  }
  connectedCallback() {
    const that = this;
    const shadowRoot = this.attachShadow({ mode: "open" });
    const title = shadowRoot.host.attributes.getNamedItem("title")?.value ?? "u-spy";
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(this.id, title, ControlElement.list(), this.ids))
    );
    shadowRoot.querySelector(`#${this.id}`)?.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
      that.remove();
    });
    for(const selector of [
      this.Selectors.ARTICLE,
      this.Selectors.DIALOG,
    ]) {
      shadowRoot.querySelector(selector)
        ?.addEventListener(EventType.CLICK, (e) => {
          e.stopPropagation();
        });
    }
    const HIDDEN_CLASS_NAME = "hidden";
    shadowRoot.querySelector<HTMLDivElement>(this.Selectors.DIALOG)?.addEventListener("blur", (e) => {
      if (e.target instanceof HTMLDivElement === false) {
        return;
      }
      e.target.classList.add(HIDDEN_CLASS_NAME);
    });
    const isDialogOpen = ref(false);
    function showDialog() {
      const keyHelpElement = shadowRoot.querySelector<KeyHelpElement>(KeyHelpElement.TAG_NAME);
      if (keyHelpElement == null) {
        return;
      }
      keyHelpElement.addEventListener("blur", () => {
        hideDialog();
      });
      keyHelpElement.setAttribute("visible", "true");
      keyHelpElement.setAttribute("key-definitions", JSON.stringify(that.store.keyDefinitions));
      keyHelpElement.focus();
      isDialogOpen.value = true;
    }

    function hideDialog() {
      const keyHelpElement = shadowRoot.querySelector<KeyHelpElement>(KeyHelpElement.TAG_NAME);
      if (keyHelpElement == null) {
        return;
      }
      keyHelpElement.setAttribute("visible", "false");
      isDialogOpen.value = false;
    }

    function helpHandler(e: KeyboardEvent) {
      if (e.key !== "?") {
        return;
      }
      showDialog();
    }
    window.addEventListener(EventType.KEYDOWN, helpHandler);
    function removalKeyHandler(e: KeyboardEvent) {
      if (e.key !== "Escape") {
        return;
      }
      if (isDialogOpen.value) {
        hideDialog();
        return;
      }

      try {
        window.removeEventListener(EventType.KEYDOWN, removalKeyHandler);
        window.removeEventListener(EventType.KEYDOWN, helpHandler);
        that.remove();
      } catch {}
    }
    window.addEventListener(EventType.KEYDOWN, removalKeyHandler);

    shadowRoot.querySelectorAll<HTMLButtonElement>(`#${this.controlListId} > li > button`).forEach((button, buttonIndex) => {
      button.addEventListener(EventType.CLICK, (e) => {
        if (e.target == null) {
          return;
        }
        if (e.target instanceof HTMLElement === false) {
          return;
        }
        const li = e.target.closest("li");
        if (li == null) {
          return;
        }
        if (li.dataset.controlId == null) {
          return;
        }
        const controlId = li.dataset.controlId;
        const ele = LogListElement.create();
        ele.setAttribute("control-id", li.dataset.controlId);
        const contentArea = shadowRoot.querySelector(this.Selectors.CONTENT);
        if (contentArea != null) {
          contentArea.innerHTML = "";
          contentArea.appendChild(ele);
        }
        shadowRoot.querySelectorAll<HTMLLIElement>(`#${this.controlListId} > li`).forEach(li => {
          const ACTIVE_CLASS_NAME = "active";
          if(li.dataset.controlId === controlId) {
            li.classList.add(ACTIVE_CLASS_NAME);
          } else {
            li.classList.remove(ACTIVE_CLASS_NAME);
          }
        });
      });
      if (buttonIndex === 0) {
        setTimeout(() => {
          button.click();
        }, 1);
      }
    });
    this.keyEventHandler = (e: KeyboardEvent) => {
      if (e.key !== "r") {
        return;
      }
      shadowRoot.querySelector<HTMLButtonElement>(`#${this.controlListId} > li.active > button`)?.click();
    };
    window.addEventListener(EventType.KEYDOWN, this.keyEventHandler);
    this.store.keyDefinitions = [
      {
        key: "?",
        description: "show help",
      },
      {
        key: "r",
        description: "refresh logs",
      },
    ];
  }
  disconnectedCallback() {
    if (this.keyEventHandler == null) {
      return;
    }
    window.removeEventListener(EventType.KEYDOWN, this.keyEventHandler);
  }
}

export function displayDialog() {
  const dialogTag = document.createElement(TAG_NAME);
  document.body.appendChild(dialogTag);
}

try {
  globalThis.customElements.define(TAG_NAME, DialogElement);
} catch {}
