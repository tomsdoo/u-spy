import type { ControlElement } from "@/components/control-element";

export function template(id: string, title: string, controlElements: ControlElement[]) {
  return `
    <div id="${id}">
      <div>
        <h1>${title}</h1>
        <ul>
          ${
            controlElements.map(
              controlElement =>
                `<li data-control-id="${controlElement.id}">
                  <button type="button">${controlElement.id}</button>
                </li>`
            ).join("")
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
        gap: 16px;
        background: rgb(0 0 0 / 90%);
        width: 90vw;
        height: 90vh;
        max-width: 90vw;
        max-height: 90vh;
        padding: 16px 32px;
        border-radius: 8px;
        box-shadow: inset 0 0 10px rgb(255 255 255 / 20%), inset 0 0 16px rgb(255 255 255 / 30%);

        > h1 {
          margin: 0;
          padding: 0.5em;
          text-align: center;
          font-size: 1em;
          line-height: 1;
         }

         > ul {
          margin-block-start: 0;
          margin-block-end: 0;
          padding-inline-start: 0;
          list-style-type: none;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 16px;

          > li {
            &.active {
              color: darkgoldenrod;
            }

            > button {
              display: grid;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              box-shadow: inset 0 0 1px;
              padding: 4px 8px;
              border-radius: 8px;
              width: 100%;
              height: 100%;
              background: transparent;
              color: inherit;
              border: 0;

              &:hover {
                box-shadow: inset 0 0 2px;
              }
            }
          }
        }

        #content {
          overflow: auto;
        }
      }
    }
    </style>
  `;
}
