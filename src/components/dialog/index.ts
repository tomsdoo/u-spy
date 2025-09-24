import { CodeEditorElement } from "@/components/code-editor";
import { CustomFormElement } from "@/components/custom-form";
import { KeyHelpElement } from "@/components/key-help";
import { LogFormElement } from "@/components/log/form";
import { StoreElement } from "@/components/store";
import { StyleEditorElement } from "@/components/style-editor";
import { SpecialChar } from "@/constants/char";
import { EventType } from "@/constants/event-type";
import { SystemEvent } from "@/constants/system-event";
import { systemBus } from "@/event-bus";
import { createTrustedHtml } from "@/trusted-policy";
import { sleep } from "@/utils";
import { DialogType, template } from "./template";

const TAG_NAME = "u-spy-dialog";

function ref<T = unknown>(initialValue: T) {
  return new Proxy(
    {
      value: initialValue,
    },
    {
      set(target, prop, value) {
        if (prop === "value") {
          target[prop] = value;
        }
        return true;
      },
    },
  );
}

type KeyDefinition = {
  key: string;
  description: string;
};
const keyDefinitionMap = new Map<string, string>();
systemBus.on(SystemEvent.SET_KEY_DEFINITION, (keyDefinition) => {
  const { key, description } = keyDefinition as KeyDefinition;
  keyDefinitionMap.set(key, description);
});
systemBus.on(SystemEvent.DELETE_KEY_DEFINITION, (key) => {
  keyDefinitionMap.delete(key as string);
});

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
  get customFormElement() {
    return this.shadowRoot?.querySelector<CustomFormElement>(
      `${CustomFormElement.TAG_NAME}`,
    );
  }
  connectedCallback() {
    const that = this;
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot = shadowRoot;
    this.shadowRoot.innerHTML = createTrustedHtml("");
    const _title =
      this.shadowRoot.host.attributes.getNamedItem("title")?.value ?? "u-spy";
    this.shadowRoot.appendChild(
      document
        .createRange()
        .createContextualFragment(
          createTrustedHtml(template(this.id, this.dialogType)),
        ),
    );
    this.shadowRoot
      .querySelector(`#${this.id}`)
      ?.addEventListener(EventType.CLICK, (e) => {
        e.stopPropagation();
        that.remove();
      });
    for (const selector of [this.Selectors.DIALOG]) {
      this.shadowRoot
        .querySelector(selector)
        ?.addEventListener(EventType.CLICK, (e) => {
          e.stopPropagation();
        });
    }
    const HIDDEN_CLASS_NAME = "hidden";
    this.shadowRoot
      .querySelector<HTMLDivElement>(this.Selectors.DIALOG)
      ?.addEventListener("blur", (e) => {
        if (e.target instanceof HTMLDivElement === false) {
          return;
        }
        e.target.classList.add(HIDDEN_CLASS_NAME);
      });
    const isDialogOpen = ref(false);
    function showDialog() {
      const keyHelpElement = shadowRoot.querySelector<KeyHelpElement>(
        KeyHelpElement.TAG_NAME,
      );
      if (keyHelpElement == null) {
        return;
      }
      keyHelpElement.addEventListener("blur", () => {
        hideDialog();
      });
      keyHelpElement.setAttribute("visible", "true");
      keyHelpElement.setAttribute(
        ":key-definitions",
        JSON.stringify(
          Array.from(keyDefinitionMap.entries())
            .map(([key, description]) => ({ key, description }))
            .toSorted((a, b) => {
              if (a.key === b.key) {
                return 0;
              }
              return a.key > b.key ? 1 : -1;
            }),
        ),
      );
      keyHelpElement.focus();
      isDialogOpen.value = true;
    }

    function hideDialog() {
      const keyHelpElement = shadowRoot.querySelector<KeyHelpElement>(
        KeyHelpElement.TAG_NAME,
      );
      if (keyHelpElement == null) {
        return;
      }
      keyHelpElement.setAttribute("visible", "false");
      isDialogOpen.value = false;
    }

    function helpHandler(e: KeyboardEvent) {
      if (e.key !== SpecialChar.QUESTION) {
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

    systemBus.emit(SystemEvent.SET_KEY_DEFINITION, {
      key: SpecialChar.QUESTION,
      description: "show help",
    });
  }
  changeType(dialogType: DialogType) {
    if (this.shadowRoot == null) {
      return;
    }
    const spyDiv = this.shadowRoot.querySelector(`#${this.id}`);
    if (spyDiv == null) {
      return;
    }
    for (const tagName of [
      LogFormElement.TAG_NAME,
      StyleEditorElement.TAG_NAME,
      CodeEditorElement.TAG_NAME,
      CustomFormElement.TAG_NAME,
    ]) {
      spyDiv.querySelectorAll(`${tagName}`).forEach((el) => {
        el.remove();
      });
    }
    switch (dialogType) {
      case DialogType.STYLE_EDITOR: {
        return spyDiv.appendChild(
          document.createElement(StyleEditorElement.TAG_NAME),
        );
      }
      case DialogType.CODE_EDITOR: {
        return spyDiv.appendChild(
          document.createElement(CodeEditorElement.TAG_NAME),
        );
      }
      case DialogType.CUSTOM_FORM: {
        return spyDiv.appendChild(
          document.createElement(CustomFormElement.TAG_NAME),
        );
      }
      default: {
        return spyDiv.appendChild(
          document.createElement(LogFormElement.TAG_NAME),
        );
      }
    }
  }
  disconnectedCallback() {
    systemBus.emit(SystemEvent.DELETE_KEY_DEFINITION, SpecialChar.QUESTION);
  }
}

export function displayDialog(
  dialogTypeName: string,
  options?: { title?: string },
): void;
export function displayDialog(
  callback: (element: HTMLElement) => void,
  options?: { title?: string },
): void;
export function displayDialog(
  params: string | ((element: HTMLElement) => void),
  options?: { title?: string },
) {
  const dialogTag =
    document.querySelector<DialogElement>(TAG_NAME) ??
    document.body.appendChild(
      document.createElement(TAG_NAME) as DialogElement,
    );
  if (typeof params === "string") {
    const dialogTypeName = params;
    switch (dialogTypeName) {
      case "style":
        dialogTag.changeType(DialogType.STYLE_EDITOR);
        break;
      case "code":
        dialogTag.changeType(DialogType.CODE_EDITOR);
        break;
      default:
        dialogTag.changeType(DialogType.LOG_LIST);
        break;
    }
    return {
      close() {
        dialogTag.remove();
      },
    };
  }
  const callback = params;
  dialogTag
    .changeType(DialogType.CUSTOM_FORM)
    ?.addEventListener("load", (e) => {
      callback(e.detail.element.querySelector("div > div"));
    });

  if (options?.title != null) {
    const title = options.title;
    void (async () => {
      await sleep(1);
      dialogTag.customFormElement?.changeTitle(title);
    })();
  }

  return {
    close() {
      dialogTag.remove();
    },
    changeTitle(title: string) {
      dialogTag.customFormElement?.changeTitle(title);
    },
  };
}

try {
  globalThis.customElements.define(TAG_NAME, DialogElement);
} catch {}
