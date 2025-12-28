import { EventType } from "@/constants/event-type";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NAMESPACE, tagName);
}

export function resetHandlers(instance: { id: string }) {
  (instance as unknown as HTMLElement).addEventListener(EventType.CLICK, () => {
    (instance as unknown as HTMLElement).remove();
  });

  function getSvg() {
    return (
      instance as unknown as HTMLElement
    ).shadowRoot?.querySelector<SVGSVGElement>(`#${instance.id} svg`);
  }

  const viewBoxSize = 1000;

  enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
  }

  const currentLine = {
    start: { x: viewBoxSize / 2, y: viewBoxSize / 2 },
    length: 0,
    direction: Direction.UP,
  };

  function getEndPointFromDirection({
    start,
    length,
    direction,
  }: {
    start: { x: number; y: number };
    length: number;
    direction: Direction;
  }) {
    let x = start.x;
    let y = start.y;
    switch (direction) {
      case Direction.UP:
        y -= length;
        break;
      case Direction.DOWN:
        y += length;
        break;
      case Direction.LEFT:
        x -= length;
        break;
      case Direction.RIGHT:
        x += length;
        break;
    }
    return { x, y };
  }

  const currentPathId = `${instance.id}-current-path`;
  const lineColor = `hsl(${Math.floor(Math.random() * 360)} 80% 40%)`;

  (function initializeSvg() {
    const svg = getSvg();
    if (svg == null) {
      return;
    }
    svg.setAttribute("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`);
    svg.setAttribute("xmlns", SVG_NAMESPACE);

    const path = createSVGElement("path");
    path.id = currentPathId;
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", lineColor);
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
  })();
  async function makePoint(x: number, y: number) {
    const svg = getSvg();
    if (svg == null) {
      return;
    }
    const circle = document.createElementNS(SVG_NAMESPACE, "circle");
    circle.setAttribute("cx", x.toString());
    circle.setAttribute("cy", y.toString());
    circle.setAttribute("r", "3");
    circle.setAttribute("fill", lineColor);
    circle.classList.add("circle");
    svg.appendChild(circle);
    await new Promise((resolve) => setTimeout(resolve, 10));
    circle.classList.add("fade");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    circle.remove();
  }

  function makeNextPath(nextDirection: Direction) {
    const svg = getSvg();
    if (svg == null) {
      return;
    }
    const currentPath = svg.querySelector<SVGPathElement>(`#${currentPathId}`);
    if (currentPath != null) {
      currentPath.removeAttribute("id");
      currentLine.start = getEndPointFromDirection({
        start: currentLine.start,
        length: currentLine.length,
        direction: currentLine.direction,
      });
      currentLine.length = 0;
      currentLine.direction = nextDirection;
      makePoint(currentLine.start.x, currentLine.start.y);
    }

    const path = createSVGElement("path");
    path.id = currentPathId;
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", lineColor);
    path.setAttribute("stroke-width", "2");
    svg?.appendChild(path);
  }
  function updateCurrentPath(changeDirection: boolean) {
    const svg = getSvg();
    if (svg == null) {
      return false;
    }
    if (changeDirection) {
      const nextDirectionCandidates = [
        Direction.UP,
        Direction.DOWN,
        Direction.LEFT,
        Direction.RIGHT,
      ].filter((nextDirection) => nextDirection !== currentLine.direction);
      const randIndex = Math.floor(
        Math.random() * nextDirectionCandidates.length,
      );
      const nextDirection = nextDirectionCandidates[randIndex];
      makeNextPath(nextDirection);
    }
    const currentPath = svg.querySelector<SVGPathElement>(`#${currentPathId}`);
    if (currentPath == null) {
      return false;
    }
    currentLine.length += 2;
    let d = `M ${currentLine.start.x} ${currentLine.start.y} `;
    const { x, y } = getEndPointFromDirection({
      start: currentLine.start,
      length: currentLine.length,
      direction: currentLine.direction,
    });
    d += `L ${x} ${y} `;
    currentPath.setAttribute("d", d);
    return true;
  }

  function startGame() {
    const timerId = setInterval(() => {
      // Randomly change direction
      const rand = Math.random();
      const changeDirection = rand < 0.2;
      const isProceeding = updateCurrentPath(changeDirection);
      if (isProceeding === false) {
        clearInterval(timerId);
      }
    }, 50);
  }
  return {
    startGame,
  };
}
