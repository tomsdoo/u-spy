import { EventType } from "@/constants/event-type";

export class KeyWaiter {
  wantedText: string;
  currentIndex: number;
  constructor(wantedText: string) {
    this.wantedText = wantedText;
    this.currentIndex = 0;
  }
  get currentText() {
    return this.wantedText.slice(0, this.currentIndex);
  }
  get wantedKey() {
    return this.wantedText.charAt(this.currentIndex);
  }
  get isSatisfied() {
    return this.wantedText === this.currentText;
  }
  feed(key: string) {
    if (key !== this.wantedKey) {
      this.clear();
      return;
    }
    this.currentIndex += 1;
  }
  clear() {
    this.currentIndex = 0;
  }
}

export function registerHotStroke(wantedText: string, handler: () => void) {
  const keyWaiter = new KeyWaiter(wantedText.toLowerCase());
  function keyHandler(e: KeyboardEvent) {
    keyWaiter.feed(e.key);
    if (keyWaiter.isSatisfied) {
      keyWaiter.clear();
      void handler();
    }
  }
  window.addEventListener(EventType.KEYDOWN, keyHandler);
  function unregisterHotStroke() {
    window.removeEventListener(EventType.KEYDOWN, keyHandler);
  }
  const readonlyWaiter = new Proxy({
    currentIndex: keyWaiter.currentIndex,
    currentText: keyWaiter.currentText,
  }, {
    get(obj, prop, receiver) {
      if (prop === "currentIndex") {
        return keyWaiter.currentIndex;
      }
      if (prop === "currentText") {
        return keyWaiter.currentText;
      }
      return Reflect.get(obj, prop, receiver);
    },
    set() {
      return true;
    },
  });
  return {
    unregisterHotStroke,
    waiter: readonlyWaiter,
  };
}
