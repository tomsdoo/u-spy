import { EventType } from "@/constants/event-type";
import { sleep } from "@/utils";
import { range } from "@/utils/array";

export function resetHandlers(instance: {
  id: string;
  boardWidthValue: number;
  boardHeightValue: number;
}) {
  (instance as unknown as HTMLElement).addEventListener(EventType.CLICK, () => {
    (instance as unknown as HTMLElement).remove();
  });

  async function startGame() {
    const cellMap = new Map<
      string,
      { x: number; y: number; score: number; element: HTMLElement }
    >();
    const positionKeys: string[] = [];
    function toPositionKey(x: number, y: number) {
      return `${x}-${y}`;
    }
    for (const cellElement of Array.from(
      (
        instance as unknown as HTMLElement
      ).shadowRoot?.querySelectorAll<HTMLElement>(
        `#${instance.id} .board .cell[data-x][data-y]`,
      ) ?? [],
    )) {
      const x = Number(cellElement.dataset.x);
      const y = Number(cellElement.dataset.y);
      const score = Number(cellElement.dataset.score);
      const positionKey = toPositionKey(x, y);
      cellMap.set(positionKey, {
        x,
        y,
        score,
        element: cellElement,
      });
      positionKeys.push(positionKey);
    }
    const nextSnowfallPoints: { x: number; y: number }[] = [];
    function proceedNext() {
      const snowfallPoints = [
        ...range(0, 9).map((_) => ({
          x: Math.floor(Math.random() * instance.boardWidthValue),
          y: Math.floor(Math.random() * instance.boardHeightValue),
        })),
        ...nextSnowfallPoints.splice(0, nextSnowfallPoints.length),
      ];
      for (const positionKey of positionKeys) {
        const cell = cellMap.get(positionKey);
        if (cell == null || cell.element == null) {
          return false;
        }
        const isSnowfallPoint =
          snowfallPoints.find((p) => p.x === cell.x && p.y === cell.y) != null;
        const newScore = isSnowfallPoint ? cell.score + 1 : cell.score;
        if (newScore > 4) {
          nextSnowfallPoints.push({ x: cell.x - 1, y: cell.y });
          nextSnowfallPoints.push({ x: cell.x + 1, y: cell.y });
          nextSnowfallPoints.push({ x: cell.x, y: cell.y - 1 });
          nextSnowfallPoints.push({ x: cell.x, y: cell.y + 1 });
        }
        cell.score = newScore > 4 ? 0 : newScore;
        cell.element.dataset.score = String(cell.score);
      }
      return true;
    }
    while (document.contains(instance as unknown as HTMLElement)) {
      const isContinue = proceedNext();
      if (isContinue === false) {
        break;
      }
      await sleep(10);
    }
  }
  return { startGame };
}
