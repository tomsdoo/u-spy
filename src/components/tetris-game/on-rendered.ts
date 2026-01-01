import { EventType } from "@/constants/event-type";
import { forceReflow, sleep } from "@/utils";
import { chooseRandomlyFromArray } from "@/utils/random";
import { Board } from "./board";
import { Occupied } from "./occupied";
import { createRandomTetrimino } from "./tetrimino";

export function resetHandlers(instance: {
  id: string;
  boardWidthValue: number;
  boardHeightValue: number;
  render: () => Promise<void>;
}) {
  (instance as unknown as HTMLElement).addEventListener(EventType.CLICK, () => {
    (instance as unknown as HTMLElement).remove();
  });
  async function startGame() {
    if (instance.boardWidthValue <= 0 || instance.boardHeightValue <= 0) {
      return;
    }
    const tetriminos: ReturnType<typeof createRandomTetrimino>[] = [];
    const board = new Board(
      instance.boardWidthValue,
      instance.boardHeightValue,
    );
    const boardElement = (
      instance as unknown as HTMLElement
    ).shadowRoot?.querySelector<HTMLElement>(`#${instance.id} .board`);
    if (boardElement == null) {
      return;
    }
    board.bindElement(boardElement);

    while (document.contains(instance as unknown as HTMLElement)) {
      const deadTetriminos = tetriminos.filter((t) => t.isActive === false);
      const occupied = new Occupied(
        deadTetriminos.flatMap((deadTetrimino) => deadTetrimino.getCells()),
      );
      const activeTetrimino = (() => {
        const existingTetrimino = tetriminos.find((t) => t.isActive);
        if (existingTetrimino != null) {
          return existingTetrimino;
        }
        const newTetrimino = createRandomTetrimino(
          Math.floor(instance.boardWidthValue / 2),
          0,
        );
        tetriminos.push(newTetrimino);
        return newTetrimino;
      })();
      if (Math.random() < 0.1) {
        activeTetrimino.changeDegree();
        if (occupied.includes(activeTetrimino.getCells())) {
          activeTetrimino.changeDegree(true);
        }
      }
      let movedX = false;
      if (
        Math.random() < 0.1 &&
        activeTetrimino.x + 2 < instance.boardWidthValue
      ) {
        activeTetrimino.addX(1);
        if (occupied.includes(activeTetrimino.getCells())) {
          activeTetrimino.addX(-1);
        } else {
          movedX = true;
        }
      }
      if (movedX === false && Math.random() < 0.1 && activeTetrimino.x > 2) {
        activeTetrimino.addX(-1);
        if (occupied.includes(activeTetrimino.getCells())) {
          activeTetrimino.addX(1);
        } else {
          movedX = true;
        }
      }
      activeTetrimino.addY(1);
      if (occupied.includes(activeTetrimino.getCells())) {
        activeTetrimino.addY(-1);
        activeTetrimino.deactivate();
      }
      const maxY = activeTetrimino
        .getCells()
        .reduce((maxY, { y }) => Math.max(maxY, y), 0);
      if (maxY >= instance.boardHeightValue - 1) {
        activeTetrimino.deactivate();
      }
      const isGameOver =
        activeTetrimino.isActive === false && activeTetrimino.y === 0;
      board.clearCells();
      for (const tetrimino of tetriminos) {
        for (const cell of tetrimino.getCells()) {
          board.updateCellChar(cell.x, cell.y, tetrimino.char);
        }
      }
      board.reflectCellUpdates();
      if (isGameOver) {
        break;
      }

      forceReflow();
      await sleep(10);
    }
    let interval = 25;
    setTimeout(() => {
      interval = 10;
    }, 300);
    setTimeout(() => {
      interval = 5;
    }, 800);
    setTimeout(() => {
      interval = 2;
    }, 1000);
    while (document.contains(instance as unknown as HTMLElement)) {
      const remainingCells = Array.from(board.cellMap.values()).filter(
        (cell) =>
          cell.char !== "" &&
          cell.element?.classList.contains("collapsed") !== true,
      );
      if (remainingCells.length === 0) {
        break;
      }
      for (const _ of Array.from({ length: 10 })) {
        const cell = chooseRandomlyFromArray(remainingCells);
        if (cell != null && cell.element != null) {
          cell.element.classList.add("collapsed");
        }
      }
      forceReflow();
      await sleep(interval);
    }
    await sleep(1000);
    (instance as unknown as HTMLElement).remove();
  }

  return {
    startGame,
  };
}
