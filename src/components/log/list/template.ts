import { ControlElement } from "@/components/control-element";
import {
  transformLogItem,
} from "@/components/log/list/util";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour12: false,
  hour:   '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

function formatTime(dateValue: Date) {
  return formatter.format(dateValue);
}

export function template(
  id: string,
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
          logItems.map(logItem => {
            const {
              method,
              url,
              host,
              body,
              response,
            } = transformLogItem(logItem);
            return `
            <li id="${logItem.id}">
              <div>
                <div>
                  <div class="time">${formatTime(logItem.time)}</div>
                  <div class="type">${logItem.type}</div>
                  <div class="method">${method}</div>
                </div>
                <div class="host">
                  <abbr title="${url}">${host}</abbr>
                  <a href="${url}" target="_blank">${url}</a>
                </div>
               </div>
               <div data-foldable class="body folded">${body == null ? "" : body}</div>
               <div data-foldable class="response folded">${response == null ? "" : response}</div>
            </li>
            `;
          }).join("")
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

        > li {
          display: grid;
          gap: 0.2em 0.6em;
          color: steelblue;

          div {
           word-break: break-all;
           line-height: 1.4;
          }
          > div:nth-of-type(1) {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.6em;
            > div:nth-of-type(1) {
              display: flex;
              flex-direction: row;
              gap: 0.6em;
              > .type {
                text-transform: uppercase;
                color: lightskyblue;
              }
              > .method {
                color: darkkhaki;
                &:empty {
                  display: none;
                }
              }
            }
            > .host {
              > a {
                display: none;
                color: cornflowerblue;
              }
            }
            > .host.detailed {
              > abbr {
                display: none;
              }
              > a {
                display: inline;
                color: cornflowerblue;
              }
            }
          }

          > .body {
            &:empty {
              display: none;
            }
          }
          > .response {
            &:empty {
              display: none;
            }
          }
          > .folded {
            overflow: hidden;
            max-height: calc(1.5em * 2);
          }
        }

        > li.hidden {
          display: none;
        }
      }
    }
    </style>
  `;
}
