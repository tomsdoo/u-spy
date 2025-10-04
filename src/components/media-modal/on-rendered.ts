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
      void sleep(1).then(() => {
        imageElement.classList.add("hidden");
      });
    }
    const imageElement = getImageElements()[nextIndex];
    imageElement.classList.remove("hidden");
    await sleep(1);
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
