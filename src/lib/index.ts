import {
  getRegisteredHotStroke,
  getRegisteredHotStrokes,
  registerHotStroke,
} from "@/key-event";

export { createEventBus } from "@/event-bus";
export { createFreeContainer } from "@/free-container";
export { download } from "@/utils/download";
export { replaceContent } from "@/utils/replace-content";
export { sleep } from "@/utils/sleep";
export { ensureTemplateView } from "@/components/dynamic-element/template-view";
export const hotStroke = {
    register: registerHotStroke,
    get keys() {
      return getRegisteredHotStrokes();
    },
    get(key: string) {
      return getRegisteredHotStroke(key);
    },
    unregister(key: string) {
      getRegisteredHotStroke(key)?.unregisterHotStroke();
    },
    unregisterAll() {
      for (const key of getRegisteredHotStrokes()) {
        getRegisteredHotStroke(key)?.unregisterHotStroke();
      }
    },
};
