import { ControlElement } from "@/components/control-element";
import { LogItemElement } from "@/components/log/item";

export function template(
  id: string,
  controlId: string,
  logItems: ControlElement["logItems"],
  {
    formId,
    keyBoxId,
    logListId,
  }: {
    formId: string;
    keyBoxId: string;
    logListId: string;
  },
) {
  return `
    <div id="${id}">
      <form id="${formId}">
        <input id="${keyBoxId}" placeholder="keyword.." />
      </form>
      <ul id="${logListId}">
        ${
          logItems.map(logItem => `
            <${LogItemElement.TAG_NAME}
              :control-id=${JSON.stringify(controlId)}
              :log-id=${JSON.stringify(logItem.id)}
            ></${LogItemElement.TAG_NAME}>
          `).join("")
        }
      </ul>
    </div>
    <style>
    #${id} {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 16px;
      max-height: 100%;

      ul,
      ol {
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        list-style-type: none;
      }

      > form {
       display: grid;
       justify-content: end;

       > input {
         padding: 4px 8px;
         background: transparent;
         color: inherit;
         box-shadow: inset 0 0 1px;
         border: 0;
       }
      }

      > * {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      > *::-webkit-scrollbar{
        display:none;
      }

      > #${logListId} {
        color: #cccccc;
        overflow: auto;
        display: grid;
        gap: 2em;
        scroll-behavior: smooth;

        > ${LogItemElement.TAG_NAME}.hidden {
          display: none;
        }
      }
    }
    </style>
  `;
}
