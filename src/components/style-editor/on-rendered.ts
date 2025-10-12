import { InputFormElement } from "@/components/input-form";
import { SelectFormElement } from "@/components/select-form";
import { EventType } from "@/constants/event-type";
import type { createStorageProxy } from "@/storage";
import { download, prettierFormat, sleep } from "@/utils";

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
      // @ts-expect-error handler type will be resolved
      saveForm.removeEventListener(
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
    function saveHandler(e: { detail: { value: string } }) {
      const nextData = {
        ...instance.storageData,
        [e.detail.value]: textarea?.value ?? "",
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
      selectForm?.classList.add("hidden");
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
      selectForm?.removeEventListener(
        SelectFormElement.CANCEL_EVENT,
        clearAndHide,
      );
      textarea?.focus();
    }
    function chooseHandler(e: { detail: { value: string } }) {
      // biome-ignore lint/style/noNonNullAssertion: exists
      textarea!.value = instance.storageData[e.detail.value];
      instance.styleText = instance.storageData[e.detail.value];
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
}
