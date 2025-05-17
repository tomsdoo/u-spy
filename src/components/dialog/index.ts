import { DialogType, template } from "./template";
import { EventType } from "@/constants/event-type";
import { KeyHelpElement } from "@/components/key-help";
import { StoreElement } from "@/components/store";
import { LogFormElement } from "@/components/log/form";
import { StyleEditorElement } from "@/components/style-editor";

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
  dialogId: string;
  dialogType: DialogType;
  store: StoreElement = StoreElement.ensure();
  shadowRoot: ShadowRoot | null;
  keyEventHandler: ((e: KeyboardEvent) => void) | null = null;
  constructor() {
    super();
    this.id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    this.dialogId = `usd-${crypto.randomUUID().replace(/-/g, "")}`;
    this.dialogType = DialogType.LOG_LIST;
    this.shadowRoot = null;
  }
  get Selectors() {
    return {
      DIALOG: `${KeyHelpElement.TAG_NAME}`,
    };
  }
  connectedCallback() {
    const that = this;
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot = shadowRoot;
    this.shadowRoot.innerHTML = "";
    const title = this.shadowRoot.host.attributes.getNamedItem("title")?.value ?? "u-spy";
    this.shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(this.id, this.dialogType))
    );
    this.shadowRoot.querySelector(`#${this.id}`)?.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
      that.remove();
    });
    for(const selector of [
      this.Selectors.DIALOG,
    ]) {
      this.shadowRoot.querySelector(selector)
        ?.addEventListener(EventType.CLICK, (e) => {
          e.stopPropagation();
        });
    }
    const HIDDEN_CLASS_NAME = "hidden";
    this.shadowRoot.querySelector<HTMLDivElement>(this.Selectors.DIALOG)?.addEventListener("blur", (e) => {
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
  changeType(dialogType: DialogType) {
    if (this.shadowRoot == null) {
      return;
    }
    const spyDiv = this.shadowRoot.querySelector(`#${this.id}`);
    if (spyDiv == null) {
      return;
    }
    for(const tagName of [
      LogFormElement.TAG_NAME,
      StyleEditorElement.TAG_NAME,
    ]) {
      spyDiv.querySelectorAll(`${tagName}`).forEach(el => {
        el.remove();
      });
    }
    switch(dialogType) {
      case DialogType.STYLE_EDITOR: {
        spyDiv.appendChild(document.createElement(StyleEditorElement.TAG_NAME));
        break;
      }
      default: {
        spyDiv.appendChild(document.createElement(LogFormElement.TAG_NAME));
        break;
      }
    }
  }
}

export function displayDialog(dialogTypeName: string) {
  const dialogTag = document.querySelector<DialogElement>(TAG_NAME)
    ?? document.body.appendChild(document.createElement(TAG_NAME) as DialogElement);
  switch(dialogTypeName) {
    case "style":
      dialogTag.changeType(DialogType.STYLE_EDITOR);
      break;
    default:
      dialogTag.changeType(DialogType.LOG_LIST);
      break;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, DialogElement);
} catch {}
