import { range } from "@/utils/array";

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
  for (const y of range(0, boardHeightValue - 1)) {
    for (const x of range(0, boardWidthValue - 1)) {
      cells.push({
        x,
        y,
        score: Math.floor(Math.random() * 4),
      });
    }
  }

  const cellColor = `hsl(${Math.floor(Math.random() * 360)} 80% 30%)`;

  return `<div id="${id}">
    <div class="board">
      ${cells.map(({ x, y, score }) => `<div data-x="${x}" data-y="${y}" data-score="${score}" class="cell"></div>`).join("")}
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
    background: rgb(0 0 0 / 85%);
    z-index: calc(infinity);
    > .board {
      display: grid;
      grid-template-rows: repeat(${boardHeightValue}, auto);
      grid-template-columns: repeat(${boardWidthValue}, auto);
      gap: 1px;
      > .cell {
        background: ${cellColor};
        width: 6px;
        height: 6px;
        border-radius: 2px;
        &[data-score="0"] {
          opacity: 0;
        }
        &[data-score="1"] {
          opacity: 0.2;
        }
        &[data-score="2"] {
          opacity: 0.4;
        }
        &[data-score="3"] {
          opacity: 0.6;
        }
        &[data-score="4"] {
          opacity: 1;
        }
      }
    }
  }
  </style>`;
}
