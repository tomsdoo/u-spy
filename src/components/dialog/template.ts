import { KeyHelpElement } from "@/components/key-help";
import { LogFormElement } from "@/components/log/form";

export function template(id: string) {
  return `
    <div id="${id}">
      <${LogFormElement.TAG_NAME}></${LogFormElement.TAG_NAME}>
      <${KeyHelpElement.TAG_NAME} visible="false" tabindex="-1"></${KeyHelpElement.TAG_NAME}>
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

      ul,
      ol {
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        list-style-type: none;
      }
    }
    </style>
  `;
}
