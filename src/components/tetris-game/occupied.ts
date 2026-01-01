interface Cell {
  x: number;
  y: number;
}
export class Occupied {
  protected cells: Cell[];
  constructor(cells: Cell[]) {
    this.cells = cells;
  }
  public includes(targetCells: Cell[]) {
    const occupiedCells = this.cells;
    return targetCells.some((targetCell) =>
      occupiedCells.some(
        (occupiedCell) =>
          occupiedCell.x === targetCell.x && occupiedCell.y === targetCell.y,
      ),
    );
  }
}
