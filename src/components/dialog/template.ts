import type { ControlElement } from "@/components/control-element";

export function template(id: string, title: string, controlElements: ControlElement[]) {
  return `
    <div id="${id}">
      <div>
        <h1>${title}</h1>
        <ul>
          ${
            controlElements.map(controlElement => `<li data-control-id="${controlElement.id}">${controlElement.id}</li>`)
          }
        </ul>
        <div id="content"></div>
      </div>
    </div>
    <style>
    #${id} {
      position: fixed;
      display: grid;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      color: #eeeeee;
      background: rgb(0 0 0 / 80%);
      z-index: calc(infinity);

      > div {
        display: grid;
        grid-template-rows: auto auto 1fr;
        background: rgb(0 0 0 / 90%);
        max-width: 90vw;
        max-height: 90vh;

        #content {
          overflow: auto;
        }
      }
    }
    </style>
  `;
}
