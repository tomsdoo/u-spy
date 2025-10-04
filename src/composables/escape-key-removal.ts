import { EventType } from "@/constants/event-type";

export function useEscapeKeyRemoval(instance: HTMLElement) {
  function removalKeyHandler(e: KeyboardEvent) {
    if (e.key !== "Escape") {
      return;
    }
    try {
      instance.remove();
      window.removeEventListener(EventType.KEYDOWN, removalKeyHandler);
    } catch {}
  }
  window.addEventListener(EventType.KEYDOWN, removalKeyHandler);
}
