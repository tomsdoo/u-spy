import { KeyHelpElement } from "@/components/key-help";
import { CustomFormElement } from "@/components/custom-form";
import { SystemEvent } from "@/constants/system-event";
import { systemBus } from "@/event-bus";
import { BaseElement } from "@/components/base";
import { DialogType, template } from "./template";
import { SpecialChar } from "@/constants/char";
import { EventType } from "@/constants/event-type";


const TAG_NAME = "u-spy-dialog";

const RENDER_EVENT = "dialog-element-render";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: DialogElement;
  }

  interface HTMLElementEventMap {
    [RENDER_EVENT]: CustomEvent<{
      customFormElement: CustomFormElement;
    }>;
  }
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

export class DialogElement extends BaseElement {
  id: string;
  dialogType: DialogType;
  keyEventHandler: ((e: KeyboardEvent) => void) | null;
  static TAG_NAME = TAG_NAME;
  static get observedAttributes() {
    return [":dialog-type"];
  }
  constructor() {
    super();
    this.id = `usd-${crypto.randomUUID()}`;
    this.template = (instance) => template(instance);
    this.dialogType = DialogType.LOG_LIST;
    this.keyEventHandler = null;
  }
  get usingShadow() {
    return true;
  }
  get customFormElement() {
    return this.shadowRoot?.querySelector<CustomFormElement>(
      `${CustomFormElement.TAG_NAME}`,
    );
  }
  get keyHelpElement() {
    return this.shadowRoot?.querySelector<KeyHelpElement>(`${KeyHelpElement.TAG_NAME}`);
  }
  get HIDDEN_CLASS_NAME() {
    return "hidden";
  }
  get isKeyHelpShown() {
    const keyHelpElement = this.keyHelpElement;
    if (keyHelpElement == null) {
      return false;
    }
    return keyHelpElement.getAttribute("visible") === "true";
  }
  showKeyHelp() {
    this.keyHelpElement?.setAttribute("visible", "true");
    this.keyHelpElement?.setAttribute(":key-definitions", JSON.stringify(
      Array.from(keyDefinitionMap.entries())
        .map(([key, description]) => ({ key, description }))
        .toSorted((a, b) => {
          if (a.key === b.key) {
            return 0;
          }
          return a.key > b.key ? 1 : -1;
        }),
    ));
    this.keyHelpElement?.classList.remove(this.HIDDEN_CLASS_NAME);
    this.keyHelpElement?.focus();
  }
  hideKeyHelp() {
    this.keyHelpElement?.setAttribute("visible", "false");
    this.keyHelpElement?.classList.add(this.HIDDEN_CLASS_NAME);
  }
  connectedCallback() {
    this.keyEventHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case SpecialChar.QUESTION:
          this.showKeyHelp();
          return;
        case "Escape":
          if (e.target instanceof KeyHelpElement) {
            this.hideKeyHelp();
            return;
          }
          if (this.keyEventHandler != null) {
            window.removeEventListener(EventType.KEYDOWN, this.keyEventHandler);
          }
          this.remove();
          return;
        default:
          return;
      }
    };
    window.addEventListener(EventType.KEYDOWN, this.keyEventHandler);
    systemBus.emit(SystemEvent.SET_KEY_DEFINITION, {
      key: SpecialChar.QUESTION,
      description: "show help",
    });
  }
  onRendered() {
    this.shadowRoot?.querySelector(`#${this.id}`)?.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
      this.remove();
    });
    this.keyHelpElement?.addEventListener(EventType.BLUR, (e) => {
      this.hideKeyHelp();
    });
    this.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: {
      customFormElement: this.customFormElement,
    }}));
  }
  disconnectedCallback() {
    systemBus.emit(SystemEvent.DELETE_KEY_DEFINITION, SpecialChar.QUESTION);
  }
  static create() {
    return document.body.appendChild(document.createElement(DialogElement.TAG_NAME)) as DialogElement;
  }
  static ensure(dialogType: DialogType) {
    const dialogTag = document.querySelector<DialogElement>(DialogElement.TAG_NAME) ?? DialogElement.create();
    dialogTag.setAttribute(":dialog-type", dialogType);
    return dialogTag;
  }
}

function resolveDialogType(dialogTypeName: string) {
  switch(dialogTypeName) {
    case "style":
      return DialogType.STYLE_EDITOR;
    case "code":
      return DialogType.CODE_EDITOR;
    default:
      return DialogType.LOG_LIST;
  }
}

export function displayDialog(
  displayTypeName: string,
): {
  close: () => void;
};
export function displayDialog(
  callback: (element: HTMLElement) => void,
  options?: { title?: string },
): {
  close: () => void;
  changeTitle: (title: string) => void;
};
export function displayDialog(
  params: string | ((element: HTMLElement) => void),
  options?: { title?: string },
) {
  if (typeof params === "string") {
    const dialogElement = DialogElement.ensure(resolveDialogType(params));
    return {
      close() {
        dialogElement.remove();
      },
    };
  }
  const callback = params;
  const dialogElement = DialogElement.ensure(DialogType.CUSTOM_FORM);
  dialogElement.addEventListener(RENDER_EVENT, (e: { detail: { customFormElement: CustomFormElement }}) => {
    const customFormElement = e.detail.customFormElement;
    customFormElement.addEventListener(CustomFormElement.LOADED_EVENT, (e) => {
      if (options?.title != null) {
        const title = options.title;
        customFormElement.changeTitle(title);
      }
      callback((e as CustomEvent<{ element: CustomFormElement }>).detail.element.querySelector("div > div")!);
    });
  });

  return {
    close() {
      dialogElement.remove();
    },
    changeTitle(title: string) {
      dialogElement.customFormElement?.changeTitle(title);
    },
  };
}

try {
  globalThis.customElements.define(TAG_NAME, DialogElement);
} catch {}
