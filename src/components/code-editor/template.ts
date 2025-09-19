import { InputFormElement } from "@/components/input-form";
import { SelectFormElement } from "@/components/select-form";

export async function template({ id }: { id: string }) {
  return `
    <div id="${id}">
      <h1>u-spy code</h1>
      <ul>
        <li>
          <button class="format-button">format</button>
        </li>
        <li>
          <button class="load-button">load</button>
        </li>
        <li>
          <button class="save-button">save</button>
        </li>
        <li>
          <button class="execute-button">execute</button>
        </li>
      </ul>
      <form onsubmit="return false" class="editor-form">
        <textarea></textarea>
      </form>
      <${InputFormElement.TAG_NAME}
        class="save-form hidden"
        :text="name for code"
        :button-caption="save"
        :cancel-caption="cancel"
      ></${InputFormElement.TAG_NAME}>
      <${SelectFormElement.TAG_NAME}
        class="select-form hidden"
        :title-text="choose one to load code"
        :options=""
        :can-remove="true"
      ></${SelectFormElement.TAG_NAME}>
    </div>
    <style>
    #${id} {
      display: grid;
      grid-template-rows: auto auto 1fr;
      gap: 16px;
      background: rgb(0 0 0 / 40%);
      width: 90vw;
      height: 90vh;
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
        grid-template-columns: repeat(4, max-content);
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
            color: inherit;
            &:hover {
              box-shadow: inset 0 0 2px;
            }
          }
        }
      }
      > .editor-form {
        display: grid;

        > textarea {
          width: 100%;
          height: 100%;
          overflow: auto;
          padding: 1em;
          box-sizing: border-box;
          color: inherit;
          background: transparent;
        }
      }
      > .save-form,
      > .select-form {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       &.hidden {
         display: none;
       }
      }
    }
    </style>
  `;
}
