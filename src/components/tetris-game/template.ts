import { range } from "@/utils/array";

export async function template({
  id,
  shadowHostStyle,
  boardWidthValue,
  boardHeightValue,
}: {
  id: string;
  shadowHostStyle: string;
  boardWidthValue: number;
  boardHeightValue: number;
}) {
  const cells = [];
  for (const y of range(0, boardHeightValue - 1)) {
    for (const x of range(0, boardWidthValue - 1)) {
      cells.push({
        x,
        y,
        char: "",
        key: `${x}-${y}`,
      });
    }
  }

  const charColors = Object.fromEntries(
    ["i", "o", "s", "z", "j", "l", "t"].map((char) => [
      char,
      `hsl(${Math.floor(Math.random() * 360)} 80% 30%)`,
    ]),
  );

  return `<div id="${id}">
    <div class="board">
      ${cells.map(({ x, y, char, key }) => `<div class="cell" data-point-key="${key}" data-x="${x}" data-y="${y}" data-char="${char}"></div>`).join("")}
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
    .board {
      display: grid;
      grid-template-columns: repeat(${boardWidthValue}, max-content);
      overflow: hidden;
      .cell {
        background: transparent;
        width: 2vmin;
        height: 2vmin;
        ${Object.entries(charColors)
          .map(
            ([char, color]) =>
              `&[data-char="${char}"] { background: ${color}; }`,
          )
          .join(" ")}
        &.collapsed {
          animation: collapse-${id} 2s forwards;
        }
      }
    }
  }
  @keyframes collapse-${id} {
    to {
      transform: translateY(100vh);
    }
  }
  </style>
  `;
}
