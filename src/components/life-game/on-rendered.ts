import { EventType } from "@/constants/event-type";

export function resetHandlers(instance: {
  id: string;
  boardWidthValue: number;
  boardHeightValue: number;
}) {
  (instance as unknown as HTMLElement).addEventListener(EventType.CLICK, () => {
    (instance as unknown as HTMLElement).remove();
  });

  const cellMap = new Map<
    string,
    {
      x: number;
      y: number;
      alive: boolean;
      nextAlive: boolean | null;
      element: HTMLElement;
    }
  >();
  const positionKeys: string[] = [];
  function toPositionKey(x: number, y: number) {
    return `${x}-${y}`;
  }
  for (const cellElement of Array.from(
    (
      instance as unknown as HTMLElement
    ).shadowRoot?.querySelectorAll<HTMLElement>(
      `#${instance.id} .board .cell[data-x][data-y][data-alive]`,
    ) ?? [],
  )) {
    const x = Number(cellElement.dataset.x);
    const y = Number(cellElement.dataset.y);
    const alive = cellElement.dataset.alive === "true";
    const positionKey = toPositionKey(x, y);
    cellMap.set(positionKey, {
      x,
      y,
      alive,
      nextAlive: null,
      element: cellElement,
    });
    positionKeys.push(positionKey);
  }
  function getCurrentAlive(x: number, y: number) {
    if (
      x < 0 ||
      y < 0 ||
      x >= instance.boardWidthValue ||
      y >= instance.boardHeightValue
    ) {
      return false;
    }
    const positionKey = toPositionKey(x, y);
    // biome-ignore lint/style/noNonNullAssertion: exists
    const { alive } = cellMap.get(positionKey)!;
    return alive;
  }
  function getAroundScore(x: number, y: number) {
    return [
      { x: x - 1, y: y - 1 },
      { x: x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y },
      { x: x + 1, y },
      { x: x - 1, y: y + 1 },
      { x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ].filter(({ x, y }) => getCurrentAlive(x, y)).length;
  }
  function calculateNextAlive(x: number, y: number) {
    // biome-ignore lint/style/noNonNullAssertion: exists
    const { alive } = cellMap.get(toPositionKey(x, y))!;
    const score = getAroundScore(x, y);
    if (alive === false) {
      return score === 3;
    }
    return [2, 3].includes(score);
  }
  function setNextAlive() {
    let changed = false;
    for (const positionKey of positionKeys) {
      // biome-ignore lint/style/noNonNullAssertion: exists
      const currentCell = cellMap.get(positionKey)!;
      const nextAlive = calculateNextAlive(currentCell.x, currentCell.y);
      cellMap.set(positionKey, {
        ...currentCell,
        nextAlive,
      });
      changed = changed || currentCell.alive !== nextAlive;
    }
    return changed;
  }
  function reflectAlive() {
    for (const positionKey of positionKeys) {
      // biome-ignore lint/style/noNonNullAssertion: exists
      const currentCell = cellMap.get(positionKey)!;
      currentCell.element.dataset.alive = `${currentCell.nextAlive}`;
      cellMap.set(positionKey, {
        ...currentCell,
        alive: currentCell.nextAlive ?? false,
        nextAlive: null,
      });
    }
  }

  async function startGame() {
    while (true) {
      const changed = setNextAlive();
      if (changed === false) {
        break;
      }
      reflectAlive();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return {
    startGame,
  };
}
