import { InputFormElement } from "@/components/input-form";
import { SelectFormElement } from "@/components/select-form";
import { UtilsElement } from "@/components/utils";
import { EventType } from "@/constants/event-type";
import type { createStorageProxy } from "@/storage";
import { sleep } from "@/utils";

export function resetHandlers(instance: {
  id: string;
  codeText: string;
  storageData: Record<string, string>;
  _storage: ReturnType<typeof createStorageProxy>;
}) {
  const {
    error,
    result: {
      textarea,
      formatButton,
      saveButton,
      saveForm,
      loadButton,
      selectForm,
      executeButton,
    },
  } = [
    {
      name: "textarea",
      selector: `#${instance.id} > .editor-form > textarea`,
    },
    {
      name: "formatButton",
      selector: `#${instance.id} .format-button`,
    },
    {
      name: "saveButton",
      selector: `#${instance.id} .save-button`,
    },
    {
      name: "saveForm",
      selector: `#${instance.id} .save-form`,
    },
    {
      name: "loadButton",
      selector: `#${instance.id} .load-button`,
    },
    {
      name: "selectForm",
      selector: `#${instance.id} .select-form`,
    },
    {
      name: "executeButton",
      selector: `#${instance.id} .execute-button`,
    },
  ].reduce(
    (acc, { name, selector }) => {
      const element = (instance as unknown as HTMLElement).querySelector(
        selector,
      );
      return {
        error: acc.error || element == null,
        result: {
          ...acc.result,
          [name]: element,
        },
      };
    },
    { error: false, result: {} as Record<string, Element | null> },
  ) as unknown as {
    error: boolean;
    result: {
      textarea: HTMLTextAreaElement;
      formatButton: HTMLButtonElement;
      saveButton: HTMLButtonElement;
      saveForm: HTMLFormElement;
      loadButton: HTMLButtonElement;
      selectForm: HTMLFormElement;
      executeButton: HTMLButtonElement;
    };
  };
  if (error) {
    return;
  }
  textarea.value = instance.codeText;
  textarea.addEventListener("keydown", (e) => {
    e.stopPropagation();
    setTimeout(() => {
      instance.codeText = textarea.value;
    }, 1);
    if (e.key === "Escape") {
      textarea.blur();
    }
  });
  setTimeout(() => {
    textarea.focus();
  }, 1);
  formatButton.addEventListener(EventType.CLICK, async () => {
    instance.codeText = await UtilsElement.ensure().prettierFormat(
      instance.codeText,
      "typescript",
    );
    textarea.value = instance.codeText;
    textarea.focus();
  });
  saveButton.addEventListener(EventType.CLICK, () => {
    function clearAndHide() {
      // @ts-expect-error handler type will be resolved
      saveForm.removeEventListener(
        InputFormElement.FINISH_INPUT_EVENT,
        saveHandler,
      );
      saveForm.removeEventListener(InputFormElement.CANCEL_EVENT, clearAndHide);
      saveForm.classList.add("hidden");
      textarea.focus();
    }
    function saveHandler(e: { detail: { value: string } }) {
      const nextData = {
        ...instance.storageData,
        [e.detail.value]: textarea.value,
      };
      instance._storage.data = JSON.stringify(nextData);
      clearAndHide();
    }
    // @ts-expect-error handler type will be resolved
    saveForm.addEventListener(InputFormElement.FINISH_INPUT_EVENT, saveHandler);
    saveForm.addEventListener(InputFormElement.CANCEL_EVENT, clearAndHide);
    saveForm.classList.remove("hidden");
    saveForm.focusTextBox();
  });
  loadButton.addEventListener(EventType.CLICK, async () => {
    const options = Array.from(Object.keys(instance.storageData));
    function clearAndHide() {
      selectForm.classList.add("hidden");
      // @ts-expect-error handler type will be resolved
      selectForm.removeEventListener(
        SelectFormElement.CHOOSE_EVENT,
        chooseHandler,
      );
      // @ts-expect-error handler type will be resolved
      selectForm.removeEventListener(
        SelectFormElement.REMOVE_EVENT,
        removeHandler,
      );
      selectForm.removeEventListener(
        SelectFormElement.CANCEL_EVENT,
        clearAndHide,
      );
      textarea.focus();
    }
    function chooseHandler(e: { detail: { value: string } }) {
      textarea.value = instance.storageData[e.detail.value];
      instance.codeText = instance.storageData[e.detail.value];
      clearAndHide();
    }
    function removeHandler(e: { detail: { value: string } }) {
      const nextData = Object.fromEntries(
        Object.entries(instance.storageData).filter(
          ([key]) => key !== e.detail.value,
        ),
      );
      instance._storage.data = JSON.stringify(nextData);
      clearAndHide();
    }
    selectForm.setAttribute(":options", options.join(","));
    // @ts-expect-error handler type will be resolved
    selectForm.addEventListener(SelectFormElement.CHOOSE_EVENT, chooseHandler);
    // @ts-expect-error handler type will be resolved
    selectForm.addEventListener(SelectFormElement.REMOVE_EVENT, removeHandler);
    selectForm.addEventListener(SelectFormElement.CANCEL_EVENT, clearAndHide);
    selectForm.classList.remove("hidden");
    await sleep(10);
    selectForm.focusFirstButton();
  });
  executeButton.addEventListener(EventType.CLICK, async () => {
    const scriptTag = document.createElement("script");
    const eventName = "usc-exec";
    const functionName = `usc${crypto.randomUUID().replace(/-/g, "")}`;
    const codeText = instance.codeText;
    scriptTag.innerHTML = [
      `async function ${functionName}() { window.removeEventListener("${eventName}", ${functionName}); ${codeText}}`,
      `window.addEventListener("${eventName}", ${functionName});`,
      `document.currentScript.remove();`,
    ].join("\n");
    document.body.appendChild(scriptTag);
    window.dispatchEvent(new CustomEvent(eventName));
    textarea.focus();
  });
}
