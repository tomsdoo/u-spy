export async function template({
  id,
  boardWidthValue,
  boardHeightValue,
  shadowHostStyle,
}: {
  id: string;
  boardWidthValue: number;
  boardHeightValue: number;
  shadowHostStyle: string;
}) {
  const cells = [];
  for (const y of Array.from({ length: boardHeightValue }, (_, i) => i)) {
    for (const x of Array.from({ length: boardWidthValue }, (_, i) => i)) {
      cells.push({
        alive: Math.floor(Math.random() * 2) === 0,
        x,
        y,
      });
    }
  }

  const cellColor = `hsl(${Math.floor(Math.random() * 360)} 80% 30%)`;

  return `
  <div id="${id}">
    <div class="board">
      ${cells
        .map(
          ({ x, y, alive }) => `
        <div
          data-x="${x}"
          data-y="${y}"
          data-alive="${alive}"
          class="cell"
        ></div>
      `,
        )
        .join("")}
    </div>
  </div>
  <style>
  ${shadowHostStyle}
  #${id} {
    position: fixed;
    inset: 0;
    display: grid;
    justify-content: center;
    align-items: center;
    background: rgb(0 0 0 /80%);
    z-index: calc(infinity);
    > .board {
      display: grid;
      grid-template-rows: repeat(${boardHeightValue}, auto);
      grid-template-columns: repeat(${boardWidthValue}, auto);
      gap: 1px;
      > .cell {
        background: transparent;
        width: 6px;
        height: 6px;
        border-radius: 2px;
        &[data-alive="true"] {
          background: ${cellColor};
        }
      }
    }
  }
  </style>
  `;
}
