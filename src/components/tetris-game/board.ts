import { range } from "@/utils/array";

type Cell = {
  key: string;
  x: number;
  y: number;
  char: string;
  nextChar?: string | null;
  element?: HTMLElement | null;
};

export class Board {
  width: number;
  height: number;
  cellMap: Map<string, Cell>;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cellMap = new Map();
    this.prepareCells();
  }
  protected prepareCells() {
    for (const x of range(0, this.width - 1)) {
      for (const y of range(0, this.height - 1)) {
        const key = `${x}-${y}`;
        this.cellMap.set(key, { key, x, y, char: "" });
      }
    }
  }
  public bindElement(boardElement: HTMLElement) {
    for (const cell of this.cellMap.values()) {
      const cellElement = boardElement.querySelector<HTMLElement>(
        `.cell[data-point-key="${cell.key}"]`,
      );
      cell.element = cellElement;
    }
  }
  public updateCellChar(x: number, y: number, char: string) {
    const cell = this.cellMap.get(`${x}-${y}`);
    if (cell == null) {
      console.log(`Cell not found: ${x}, ${y}`);
      return;
    }
    cell.nextChar = char;
  }
  public clearCells() {
    for (const cell of this.cellMap.values()) {
      cell.char = "";
    }
  }
  public reflectCellUpdates() {
    for (const cell of this.cellMap.values()) {
      if (cell.nextChar != null) {
        cell.char = cell.nextChar;
        cell.nextChar = null;
      }
      if (cell.element != null) {
        cell.element.dataset.char = cell.char;
      }
    }
  }
}
