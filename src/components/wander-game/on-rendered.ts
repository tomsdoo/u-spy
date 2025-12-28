import {
  createSVGElement,
  Direction,
  getEndPointFromDirection,
  SVG_NAMESPACE,
} from "@/components/wander-game/utils";
import { EventType } from "@/constants/event-type";
import { chooseRandomlyFromArray } from "@/utils/random";

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

  const allDirections = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ];

  const currentLine = {
    start: { x: viewBoxSize / 2, y: viewBoxSize / 2 },
    length: 0,
    direction: chooseRandomlyFromArray(allDirections),
  };

  const currentPathId = `${instance.id}-current-path`;
  const lineColor = `hsl(${Math.floor(Math.random() * 360)} 80% 40%)`;

  function createCurrentPathElement() {
    return createSVGElement("path", {
      id: currentPathId,
      fill: "none",
      stroke: lineColor,
      "stroke-width": "2",
    });
  }

  (function initializeSvg() {
    const svg = getSvg();
    if (svg == null) {
      return;
    }
    svg.setAttribute("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`);
    svg.setAttribute("xmlns", SVG_NAMESPACE);

    svg.appendChild(createCurrentPathElement());
  })();
  async function makePoint(x: number, y: number) {
    const svg = getSvg();
    if (svg == null) {
      return;
    }
    const circle = createSVGElement("circle", {
      cx: x.toString(),
      cy: y.toString(),
      r: "3",
      fill: lineColor,
    });
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

    svg.appendChild(createCurrentPathElement());
  }
  function updateCurrentPath(changeDirection: boolean) {
    const svg = getSvg();
    if (svg == null) {
      return false;
    }
    if (changeDirection) {
      const nextDirectionCandidates = allDirections.filter(
        (nextDirection) => nextDirection !== currentLine.direction,
      );
      const nextDirection = chooseRandomlyFromArray(nextDirectionCandidates);
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
