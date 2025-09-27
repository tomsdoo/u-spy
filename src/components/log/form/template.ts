import type { ControlElement } from "@/components/control-element";

export async function template({
  id,
  controlListId,
  contentId,
  controlElements,
}: {
  id: string;
  controlListId: string;
  contentId: string;
  controlElements: ControlElement[];
}) {
  return `
    <div id="${id}">
      <h1>u-spy log</h1>
      <ul id="${controlListId}">
        ${controlElements
          .map(
            (controlElement) =>
              `<li data-control-id="${controlElement.id}">
                <button type="button">${controlElement.id}</button>
              </li>`,
          )
          .join("")}
      </ul>
      <div id="${contentId}"></div>
    </div>
    <style>
      #${id} {
        display: grid;
        grid-template-rows: auto auto 1fr;
        gap: 16px;
        background: rgb(0 0 0 / 60%);
        width: 90vw;
        height: 90vh;
        max-width: 90vw;
        max-height: 90vh;
        padding: 16px 32px;
        border-radius: 8px;
        box-shadow: inset 0 0 10px rgb(255 255 255 / 20%), inset 0 0 16px rgb(255 255 255 / 30%);
        color: inherit;

        * {
          background: inherit;
          color: inherit;
        }

        > h1 {
          margin: 0;
          padding: 0.5em;
          text-align: center;
          font-size: 1em;
          line-height: 1;
          background: transparent;
          color: inherit;
         }

         > #${controlListId} {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 16px;
          background: transparent;
          color: inherit;

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

        #${contentId} {
          background: transparent;
          overflow: auto;
        }
      }
    </style>
  `;
}
