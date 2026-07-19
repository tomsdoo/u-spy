import { InputFormElement } from "@/components/input-form";
import { SelectFormElement } from "@/components/select-form";
import { EventType } from "@/constants/event-type";
import type { createStorageProxy } from "@/storage";
import { download, prettierFormat, sleep } from "@/utils";

function getEventValue(event: Event) {
  return (event as CustomEvent<{ value: string }>).detail.value;
}

export function resetHandlers(instance: {
  id: string;
  styleText: string;
  storageData: Record<string, string>;
  _storage: ReturnType<typeof createStorageProxy>;
  copyButton: HTMLButtonElement | null;
  formatButton: HTMLButtonElement | null;
  downloadButton: HTMLButtonElement | null;
  loadButton: HTMLButtonElement | null;
  saveButton: HTMLButtonElement | null;
  saveForm: HTMLFormElement | null;
  selectForm: HTMLFormElement | null;
  textarea: HTMLTextAreaElement | null;
}) {
  const {
    copyButton,
    formatButton,
    downloadButton,
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
    isNull(copyButton) ||
    isNull(formatButton) ||
    isNull(downloadButton) ||
    isNull(loadButton) ||
    isNull(saveButton) ||
    isNull(saveForm) ||
    isNull(selectForm) ||
    isNull(textarea)
  ) {
    return;
  }

  textarea.value = instance.styleText;
  textarea.addEventListener(EventType.KEYUP, (e) => {
    e.stopPropagation();
  });
  textarea.addEventListener(EventType.KEYDOWN, (e) => {
    e.stopPropagation();
    setTimeout(() => {
      instance.styleText = textarea.value;
    }, 1);
    if (e.key === "Escape") {
      textarea.blur();
    }
  });
  setTimeout(() => {
    textarea.focus();
  }, 1);

  downloadButton.addEventListener(EventType.CLICK, async () => {
    download({
      data: instance.styleText,
      filename: "style.css",
    });
    textarea.focus();
  });

  copyButton.addEventListener(EventType.CLICK, async () => {
    await navigator.clipboard.writeText(instance.styleText);
    textarea.focus();
  });

  formatButton.addEventListener(EventType.CLICK, async () => {
    instance.styleText = await prettierFormat(instance.styleText, "css");
    textarea.value = instance.styleText;
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
        [value]: textarea?.value ?? "",
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
      // biome-ignore lint/style/noNonNullAssertion: exists
      textarea!.value = instance.storageData[value];
      instance.styleText = instance.storageData[value];
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
}
