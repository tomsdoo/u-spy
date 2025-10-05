import { sleep } from "@/utils";

export function resetHandlers(
  instance: {
    id: string;
    imageSrcs: string[];
    isCycle: boolean;
  } & HTMLElement,
) {
  function getImageElements() {
    return Array.from(
      instance.querySelectorAll<HTMLImageElement>(
        `#${instance.id} .image-container img`,
      ),
    );
  }
  function getCurrentImageIndex() {
    return getImageElements().findIndex(
      (img) => img.classList.contains("hidden") === false,
    );
  }
  function getNextImageIndex() {
    const nextIndex = getCurrentImageIndex() + 1;
    return nextIndex >= instance.imageSrcs.length ? 0 : nextIndex;
  }
  async function cycleImage() {
    const nextIndex = getNextImageIndex();
    for (const imageElement of getImageElements().filter(
      (_, index) => index !== nextIndex,
    )) {
      imageElement.classList.remove("active");
      imageElement.classList.add("to-leave");
      void sleep(500).then(() => {
        imageElement.classList.add("hidden");
      imageElement.classList.remove("to-leave");
      });
    }
    const imageElement = getImageElements()[nextIndex];
    imageElement.classList.add("from-enter");
    imageElement.classList.remove("hidden");
    await sleep(500);
    imageElement.classList.remove("from-enter");
    imageElement.classList.add("active");
  }
  async function startCycle() {
    while (true) {
      if (instance.imageSrcs.length <= 1) {
        break;
      }
      if (!instance.isCycle) {
        break;
      }
      await cycleImage();
      await sleep(10 * 1000);
    }
  }
  return {
    startCycle,
  };
}
