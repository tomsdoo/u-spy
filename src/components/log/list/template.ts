import { ControlElement } from "@/components/control-element";
import {
  validateFetchLog,
  validateXhrLog,
  validateBeaconLog,
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
            const isFetchLog = validateFetchLog(logItem);
            const isXhrLog = validateXhrLog(logItem);
            const isBeaconLog = validateBeaconLog(logItem);
            const liClassNames = [
              isFetchLog ? "fetch-log" : "",
              isXhrLog ? "xhr-log" : "",
              isBeaconLog ? "beacon-log" : "",
            ].join(" ");
            const {
              method,
              url,
              host,
              body,
              response,
            } = transformLogItem(logItem);
            return `
            <li id="${logItem.id}" class="${liClassNames}">
              <div class="time">${formatTime(logItem.time)}</div>
              <div class="type">${logItem.type}</div>
               <div class="method">${method}</div>
               <div class="host">
                <abbr title="${url}">${host}</abbr>
                <a href="${url}" target="_blank">${url}</a>
               </div>
               <div data-foldable class="body folded">
                 ${body}
               </div>
               <div data-foldable class="response folded">${response}</div>
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

      > ul {
        color: #cccccc;
        overflow: auto;
        display: grid;
        gap: 2em;

        > li.fetch-log,
        > li.xhr-log,
        > li.beacon-log {
          display: grid;
          grid-template:
            "time type method host" auto
            "body body body body" auto
            "response response response response" auto / auto auto auto 1fr;
          gap: 0.2em 0.6em;

          > div {
           word-break: break-all;
           line-height: 1.4;
          }

          > .time {
            grid-area: time;
          }
          > .type {
            grid-area: type;
            text-transform: uppercase;
            color: darkgoldenrod;
          }
          > .method {
            grid-area: method;
            color: darkkhaki;
          }
          > .host {
            grid-area: host;
            > a {
              display: none;
            }
          }
          > .host.detailed {
            > abbr {
              display: none;
            }
            > a {
              display: inline;
              color: darkcyan;
            }
          }
          > .body {
            grid-area: body;
          }
          > .response {
            grid-area: response;
          }
          > .body.folded,
          > .response.folded {
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
