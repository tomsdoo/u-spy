export async function template({ id }: { id: string }) {
  return `
    <div id="${id}">
      <h1>u-spy custom</h1>
      <div>
      </div>
    </div>
    <style>
    #${id} {
      display: grid;
      grid-template-rows: auto auto 1fr;
      gap: 16px;
      background: transparent;
      width: 90vw;
      height: 90vh;
      max-width: 90vw;
      max-height: 90vh;
      padding: 16px 32px;
      border-radius: 8px;
      box-shadow: inset 0 0 10px rgb(255 255 255 / 20%), inset 0 0 16px rgb(255 255 255 / 30%);
      box-sizing: border-box;

      > h1 {
        margin: 0;
        padding: 0.5em;
        text-align: center;
        font-size: 1em;
        line-height: 1;
      }

      > div {
        display: grid;
        overflow: auto;
      }
    }
    </style>
  `;
}
