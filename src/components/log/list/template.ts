import { ControlElement, ControlEvents } from "@/components/control-element";

type FetchLog = ControlElement["logStore"][ControlEvents.FETCH] extends (infer T)[] ? T : never;
type XhrLog = ControlElement["logStore"][ControlEvents.XHR_LOAD] extends (infer T)[] ? T : never;

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

function getHost(url: RequestInfo | URL) {
  try {
    if (typeof url === "string") {
      return new URL(url).host;
    }
    return url;
  } catch(_) {
    return url;
  }
}

export function template(id: string, logItems: ControlElement["logItems"]) {
  function validateFetchLog(logItem: typeof logItems extends (infer T)[] ? T : never): logItem is FetchLog & { type: "fetch" } {
    return logItem.type === "fetch";
  }
  function validateXhrLog(logItem: typeof logItems extends (infer T)[] ? T : never): logItem is XhrLog & { type: "xhr" } {
    return logItem.type === "xhr";
  }
  return `
    <div id="${id}">
      <form>
        <input placeholder="keyword.." />
      </form>
      <ul>
        ${
          logItems.map(logItem => {
            const isFetchLog = validateFetchLog(logItem);
            const isXhrLog = validateXhrLog(logItem);
            const liClassNames = [
              isFetchLog ? "fetch-log" : "",
              isXhrLog ? "xhr-log" : "",
            ].join(" ");
            const fetchLogHtml = isFetchLog
              ? `
                <div class="method">
                  ${logItem.data.init?.method ?? "GET"}
                </div>
                <div class="host">
                  <abbr title="${logItem.data.input}">${getHost(logItem.data.input)}</abbr>
                  <a href="${logItem.data.input}" target="_blank">${logItem.data.input}</a>
                </div>
                <div data-foldable class="body folded">
                  ${logItem.data.init?.body ?? ""}
                </div>
                <div data-foldable class="response folded">
                  ${logItem.data.response}
                </div>
              `
              : "";
            const xhrLogHtml = isXhrLog
              ? `
                <div class="method">
                  ${logItem.data.method}
                </div>
                <div class="host">
                  <abbr title="${logItem.data.url}">${getHost(logItem.data.url)}</abbr>
                  <a href="${logItem.data.url}" target="_blank">${logItem.data.url}</a>
                </div>
                <div data-foldable class="body folded">
                  ${logItem.data.requestBody ?? ""}
                </div>
                <div data-foldable class="response folded">
                  ${logItem.data.responseText}
                </div>
              `
              : "";
            return `
            <li id="${logItem.id}" class="${liClassNames}">
              <div class="time">${formatTime(logItem.time)}</div>
              <div class="type">${logItem.type}</div>
              ${ fetchLogHtml }
               ${ xhrLogHtml }
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

      > ul {
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        list-style-type: none;
        color: #eeeeee;
        overflow: auto;
        display: grid;
        gap: 1em;

        > li.fetch-log {
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

        > li.xhr-log {
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
