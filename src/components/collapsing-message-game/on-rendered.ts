import { EventType } from "@/constants/event-type";
import { sleep } from "@/utils";
import { range } from "@/utils/array";
import { chooseRandomlyFromArray } from "@/utils/random";
import { createSVGElement, SVG_NAMESPACE } from "@/utils/svg";

export function resetHandlers(instance: {
  id: string;
  message: string;
  fontSize: string;
  fontFamily: string;
  speed: string;
}) {
  (instance as unknown as HTMLElement).addEventListener(EventType.CLICK, () => {
    (instance as unknown as HTMLElement).remove();
  });
  const particleColor = `hsl(${Math.floor(Math.random() * 360)} 80% 40%)`;

  function getSvg() {
    return (
      instance as unknown as HTMLElement
    ).shadowRoot?.querySelector<SVGSVGElement>(`#${instance.id} svg`);
  }
  function recreateSvg() {
    const existingSvg = getSvg();
    if (existingSvg != null) {
      existingSvg.remove();
    }
    return ensureSvg();
  }
  function ensureSvg() {
    const existingSvg = getSvg();
    if (existingSvg != null) {
      return existingSvg;
    }
    const svg = createSVGElement("svg", {
      viewBox: `0 0 ${window.innerWidth} ${window.innerHeight}`,
      xmlns: SVG_NAMESPACE,
    });
    (instance as unknown as HTMLElement).shadowRoot
      ?.querySelector<HTMLElement>(`#${instance.id}`)
      ?.appendChild(svg);
    return svg;
  }
  function startGame() {
    if (instance.message === "") {
      return;
    }
    recreateSvg();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.fillStyle = "#ffffff";
    context.font = `${instance.fontSize} ${instance.fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(instance.message, canvas.width / 2, canvas.height / 2);
    const iData = context.getImageData(0, 0, canvas.width, canvas.height);
    function getColor(x: number, y: number) {
      const index = y * iData.width * 4 + x * 4;
      const [r, g, b] = iData.data.slice(index, index + 3);
      return { r, g, b };
    }
    const radius = 1;
    function validateXY(xy: number) {
      return xy % radius === 0;
    }
    function isWhite(x: number, y: number) {
      const { r, g, b } = getColor(x, y);
      return r === 255 && g === 255 && b === 255;
    }
    const SLOW_STEP_CANDIDATES = [60, 80, 100];
    const NORMAL_STEP_CANDIDATES = [10, 15, 20, 30, 40, 50];
    const FAST_STEP_CANDIDATES = [3, 5, 7];
    const stepCandidates =
      {
        normal: NORMAL_STEP_CANDIDATES,
        fast: FAST_STEP_CANDIDATES,
        slow: SLOW_STEP_CANDIDATES,
      }[instance.speed as "normal" | "fast" | "slow"] ?? NORMAL_STEP_CANDIDATES;
    async function startMovement(circle: SVGCircleElement) {
      const x = Number(circle.getAttribute("cx"));
      const deltaXValue = Math.floor(Math.random() * 3);
      const deltaX = chooseRandomlyFromArray([deltaXValue, -deltaXValue, 0]);
      const y = Number(circle.getAttribute("cy"));
      const deltaYValue = Math.floor(Math.random() * 3);
      const deltaY = chooseRandomlyFromArray([deltaYValue, -deltaYValue, 0]);
      const INTERVAL = 10;
      const steps = chooseRandomlyFromArray(stepCandidates);
      const stepX = deltaX / steps;
      const stepY = deltaY / steps;
      for (let step = 0; step < steps; step++) {
        const currentX = x + stepX * step;
        const currentY = y + stepY * step;
        circle.setAttribute("cx", String(currentX));
        circle.setAttribute("cy", String(currentY));
        await sleep(INTERVAL);
      }
      setTimeout(() => {
        if (getSvg() == null) {
          return;
        }
        startMovement(circle);
      }, INTERVAL);
    }
    const xs = range(0, canvas.width - 1).filter(validateXY);
    const ys = range(0, canvas.height - 1).filter(validateXY);
    const circlePoints = xs
      .flatMap((x) => ys.map((y) => ({ x, y })))
      .filter(({ x, y }) => isWhite(x, y));
    for (const { x, y } of circlePoints) {
      const circle = createSVGElement("circle", {
        cx: x,
        cy: y,
        r: radius,
        fill: particleColor,
      });
      ensureSvg().appendChild(circle);
      startMovement(circle);
    }
  }

  return {
    startGame,
  };
}
