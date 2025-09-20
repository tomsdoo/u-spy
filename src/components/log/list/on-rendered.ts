import type { ControlElement } from "@/components/control-element";
import { LogItemElement } from "@/components/log/item";
import { EventType } from "@/constants/event-type";

export function resetHandlers(instance: {
  id: string;
  logItems: ControlElement["logItems"];
}) {
  const {
    error,
    result: { form, keyBox, logList },
  } = [
    {
      name: "form",
      selector: `#${instance.id} > form`,
    },
    {
      name: "keyBox",
      selector: `#${instance.id} > form > input`,
    },
    {
      name: "logList",
      selector: `#${instance.id} .log-list`,
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
      form: HTMLFormElement;
      keyBox: HTMLInputElement;
      logList: HTMLUListElement;
    };
  };
  if (error) {
    return;
  }

  form.addEventListener(EventType.SUBMIT, (e) => {
    e.stopPropagation();
    e.preventDefault();
  });

  keyBox.addEventListener(EventType.KEYDOWN, (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape") {
      keyBox.blur();
    }
  });
  keyBox.addEventListener(EventType.CHANGE, () => {
    const keyword = keyBox.value;
    for (const logItemElement of Array.from(
      (instance as unknown as HTMLElement).querySelectorAll<LogItemElement>(
        LogItemElement.TAG_NAME,
      ),
    )) {
      logItemElement.feedKeyword(keyword);
    }
  });

  setTimeout(() => {
    logList.scrollTo(0, instance.logItems.length * 120);
  }, 1);
}
