export async function template({ id }: { id: string }) {
  return `
    <div id="${id}">
      <h1>u-spy style</h1>
      <ul>
        <li>
          <button class="copy-button">copy</button>
        </li>
        <li>
          <button class="download-button">download</button>
        </li>
      </ul>
      <form onsubmit="return false">
        <textarea></textarea>
      </form>
    </div>
    <style>
    #${id} {
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
      box-sizing: border-box;

      > h1 {
        margin: 0;
        padding: 0.5em;
        text-align: center;
        font-size: 1em;
        line-height: 1;
      }

      > ul {
        display: grid;
        justify-content: end;
        align-items: center;
        grid-template-columns: repeat(2, max-content);
        gap: 16px;
        > li {
          button {
            display: grid;
            padding: 0.5em 1em;
            border-radius: 0.5em;
            border: 0;
            box-shadow: inset 0 0 1px;
            background: transparent;
            cursor: pointer;
            &:hover {
              box-shadow: inset 0 0 2px;
            }
          }
        }
      }

      > form {
        display: grid;

        > textarea {
          width: 100%;
          height: 100%;
          overflow: auto;
          padding: 1em;
          box-sizing: border-box;
        }
      }
    }
    </style>
  `;
}
