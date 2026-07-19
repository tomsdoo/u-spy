import { InputFormElement } from "@/components/input-form";
import { SelectFormElement } from "@/components/select-form";
import { EventType } from "@/constants/event-type";
import type { createStorageProxy } from "@/storage";
import { createTrustedHtml } from "@/trusted-policy";
import { prettierFormat, sleep } from "@/utils";

function getEventValue(event: Event) {
  return (event as CustomEvent<{ value: string }>).detail.value;
}

export function resetHandlers(instance: {
  id: string;
  codeText: string;
  storageData: Record<string, string>;
  _storage: ReturnType<typeof createStorageProxy>;
  executeButton: HTMLButtonElement | null;
  formatButton: HTMLButtonElement | null;
  loadButton: HTMLButtonElement | null;
  saveButton: HTMLButtonElement | null;
  saveForm: HTMLFormElement | null;
  selectForm: HTMLFormElement | null;
  textarea: HTMLTextAreaElement | null;
}) {
  const {
    executeButton,
    formatButton,
    loadButton,
    saveButton,
    saveForm,
    selectForm,
    textarea,
  } = instance;
  function isNull(el: unknown): el is null {
    return el == null;
  }
  if (
    isNull(executeButton) ||
    isNull(formatButton) ||
    isNull(loadButton) ||
    isNull(saveButton) ||
    isNull(saveForm) ||
    isNull(selectForm) ||
    isNull(textarea)
  ) {
    return;
  }

  textarea.value = instance.codeText;
  textarea.addEventListener(EventType.KEYUP, (e) => {
    e.stopPropagation();
  });
  textarea.addEventListener(EventType.KEYDOWN, (e) => {
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
    instance.codeText = await prettierFormat(instance.codeText, "typescript");
    textarea.value = instance.codeText;
    textarea.focus();
  });
  saveButton.addEventListener(EventType.CLICK, () => {
    function clearAndHide() {
      saveForm!.removeEventListener(
        InputFormElement.FINISH_INPUT_EVENT,
        saveHandler,
      );
      saveForm?.removeEventListener(
        InputFormElement.CANCEL_EVENT,
        clearAndHide,
      );
      saveForm?.classList.add("hidden");
      textarea?.focus();
    }
    function saveHandler(event: Event) {
      const value = getEventValue(event);
      const nextData = {
        ...instance.storageData,
        // biome-ignore lint/style/noNonNullAssertion: textarea exists
        [value]: textarea!.value,
      };
      instance._storage.data = JSON.stringify(nextData);
      clearAndHide();
    }
    saveForm.addEventListener(InputFormElement.FINISH_INPUT_EVENT, saveHandler);
    saveForm.addEventListener(InputFormElement.CANCEL_EVENT, clearAndHide);
    saveForm.classList.remove("hidden");
    saveForm.focusTextBox();
  });
  loadButton.addEventListener(EventType.CLICK, async () => {
    const options = Array.from(Object.keys(instance.storageData));
    function clearAndHide() {
      selectForm?.classList.add("hidden");
      selectForm!.removeEventListener(
        SelectFormElement.CHOOSE_EVENT,
        chooseHandler,
      );
      selectForm!.removeEventListener(
        SelectFormElement.REMOVE_EVENT,
        removeHandler,
      );
      selectForm?.removeEventListener(
        SelectFormElement.CANCEL_EVENT,
        clearAndHide,
      );
      textarea?.focus();
    }
    function chooseHandler(event: Event) {
      const value = getEventValue(event);
      // biome-ignore lint/style/noNonNullAssertion: textarea exists
      textarea!.value = instance.storageData[value];
      instance.codeText = instance.storageData[value];
      clearAndHide();
    }
    function removeHandler(event: Event) {
      const value = getEventValue(event);
      const nextData = Object.fromEntries(
        Object.entries(instance.storageData).filter(
          ([key]) => key !== value,
        ),
      );
      instance._storage.data = JSON.stringify(nextData);
      clearAndHide();
    }
    selectForm.setAttribute(":options", options.join(","));
    selectForm.addEventListener(SelectFormElement.CHOOSE_EVENT, chooseHandler);
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
    scriptTag.innerHTML = createTrustedHtml(
      [
        `async function ${functionName}() { window.removeEventListener("${eventName}", ${functionName}); ${codeText}}`,
        `window.addEventListener("${eventName}", ${functionName});`,
        `document.currentScript.remove();`,
      ].join(" "),
    );
    document.body.appendChild(scriptTag);
    window.dispatchEvent(new CustomEvent(eventName));
    textarea.focus();
  });
}
