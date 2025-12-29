import {
  createSVGElement,
  Direction,
  getEndPointFromDirection,
  SVG_NAMESPACE,
} from "@/components/wander-game/utils";
import { EventType } from "@/constants/event-type";
import { sleep } from "@/utils";
import { chooseRandomlyFromArray } from "@/utils/random";

export function resetHandlers(instance: { id: string }) {
  (instance as unknown as HTMLElement).addEventListener(EventType.CLICK, () => {
    (instance as unknown as HTMLElement).remove();
  });

  const viewBoxSize = 1000;

  const allDirections = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ];

  function getSvg() {
    return (
      instance as unknown as HTMLElement
    ).shadowRoot?.querySelector<SVGSVGElement>(`#${instance.id} svg`);
  }
  function ensureSvg() {
    const existingSvg = getSvg();
    if (existingSvg != null) {
      return existingSvg;
    }
    const svg = createSVGElement("svg", {
      viewBox: `0 0 ${viewBoxSize} ${viewBoxSize}`,
      xmlns: SVG_NAMESPACE,
    });
    (instance as unknown as HTMLElement).shadowRoot
      ?.querySelector<HTMLElement>(`#${instance.id}`)
      ?.appendChild(svg);
    return svg;
  }

  const currentLine = {
    start: { x: viewBoxSize / 2, y: viewBoxSize / 2 },
    length: 0,
    direction: chooseRandomlyFromArray(allDirections),
  };

  const currentPathId = `${instance.id}-current-path`;
  const lineColor = `hsl(${Math.floor(Math.random() * 360)} 80% 40%)`;

  function getCurrentPathElement() {
    const svg = getSvg();
    if (svg == null) {
      return null;
    }
    return svg.querySelector<SVGPathElement>(`#${currentPathId}`);
  }

  function createCurrentPathElement() {
    return createSVGElement("path", {
      id: currentPathId,
      fill: "none",
      stroke: lineColor,
      "stroke-width": 2,
    });
  }

  (function initializeSvg() {
    const svg = ensureSvg();

    svg.appendChild(createCurrentPathElement());
  })();

  async function drawTurningPoint(x: number, y: number) {
    const svg = ensureSvg();
    const circle = createSVGElement("circle", {
      cx: x,
      cy: y,
      r: 3,
      fill: lineColor,
    });
    circle.classList.add("circle");
    svg.appendChild(circle);
    await sleep(10);
    circle.classList.add("fade");
    await sleep(1000);
    circle.remove();
  }

  function rotateCurrentPath() {
    const svg = ensureSvg();
    const currentPath = getCurrentPathElement();
    if (currentPath != null) {
      currentPath.removeAttribute("id");
    }
    svg.appendChild(createCurrentPathElement());
  }

  function makeRandomTurn() {
    const nextDirectionCandidates = allDirections.filter(
      (nextDirection) => nextDirection !== currentLine.direction,
    );
    const nextDirection = chooseRandomlyFromArray(nextDirectionCandidates);
    const nextStartPoint = getEndPointFromDirection({
      start: currentLine.start,
      length: currentLine.length,
      direction: currentLine.direction,
    });
    return {
      start: nextStartPoint,
      direction: nextDirection,
    };
  }

  function updateCurrentPath() {
    const currentPath = getCurrentPathElement();
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

  function proceedNextStep(changeDirection: boolean) {
    const svg = getSvg();
    if (svg == null) {
      return false;
    }
    if (changeDirection) {
      const nextLine = makeRandomTurn();
      rotateCurrentPath();
      drawTurningPoint(nextLine.start.x, nextLine.start.y);
      currentLine.start = nextLine.start;
      currentLine.length = 0;
      currentLine.direction = nextLine.direction;
    }
    return updateCurrentPath();
  }

  function startGame() {
    const timerId = setInterval(() => {
      const rand = Math.random();
      const changeDirection = rand < 0.2;
      const isProceeding = proceedNextStep(changeDirection);
      if (isProceeding === false) {
        clearInterval(timerId);
      }
    }, 50);
  }
  return {
    startGame,
  };
}
