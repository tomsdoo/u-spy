import {
  createSVGElement,
  SVG_NAMESPACE,
} from "@/components/wander-game/utils";
import { EventType } from "@/constants/event-type";
import { sleep } from "@/utils";
import { chooseRandomlyFromArray } from "@/utils/random";

export function resetHandlers(instance: { id: string }) {
  (instance as unknown as HTMLElement).addEventListener(EventType.CLICK, () => {
    (instance as unknown as HTMLElement).remove();
  });
  const particleColor = `hsl(${Math.floor(Math.random() * 360)} 80% 40%)`;

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
      viewBox: `0 0 ${window.innerWidth} ${window.innerHeight}`,
      xmlns: SVG_NAMESPACE,
    });
    (instance as unknown as HTMLElement).shadowRoot
      ?.querySelector<HTMLElement>(`#${instance.id}`)
      ?.appendChild(svg);
    return svg;
  }
  function startGame() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.fillStyle = "#ffffff";
    context.font = `5rem fontFamily`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      "Collapsing Message Game",
      canvas.width / 2,
      canvas.height / 2,
    );
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
    async function startMovement(circle: SVGCircleElement) {
      const x = Number(circle.getAttribute("cx"));
      const deltaXValue = Math.floor(Math.random() * 3);
      const deltaX = chooseRandomlyFromArray([deltaXValue, -deltaXValue, 0]);
      const y = Number(circle.getAttribute("cy"));
      const deltaYValue = Math.floor(Math.random() * 3);
      const deltaY = chooseRandomlyFromArray([deltaYValue, -deltaYValue, 0]);
      const INTERVAL = 10;
      const steps = chooseRandomlyFromArray([3, 5, 10]);
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
    for (const { x, y } of Array.from({ length: canvas.width }, (_, x) => x)
      .filter(validateXY)
      .flatMap((x) =>
        Array.from({ length: canvas.height }, (_, y) => y)
          .filter(validateXY)
          .map((y) => ({ x, y })),
      )
      .filter(({ x, y }) => isWhite(x, y))) {
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
