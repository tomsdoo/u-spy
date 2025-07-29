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

const registeredHotStrokeMap = new Map<string, {
  unregisterHotStroke: () => void;
  waiter: {
    currentIndex: number;
    currentText: string;
  };
}>();

export function getRegisteredHotStrokes() {
  return Array.from(registeredHotStrokeMap.keys());
}

export function getRegisteredHotStroke(wantedText: string) {
  return registeredHotStrokeMap.get(wantedText);
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
    registeredHotStrokeMap.delete(wantedText);
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

  registeredHotStrokeMap.set(wantedText, {
    unregisterHotStroke,
    waiter: readonlyWaiter,
  });

  return {
    unregisterHotStroke,
    waiter: readonlyWaiter,
  };
}
