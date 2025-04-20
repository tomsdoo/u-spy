import { ControlElement, ControlEvents } from "@/components/control-element";

type FetchLog = ControlElement["logStore"][ControlEvents.FETCH] extends (infer T)[] ? T : never;
type XhrLog = ControlElement["logStore"][ControlEvents.XHR_LOAD] extends (infer T)[] ? T : never;

export function template(id: string, logStore: ControlElement["logStore"]) {
  const logItems = [
    ...logStore[ControlEvents.FETCH].map(fetchLog => ({
      ...fetchLog,
      type: "fetch",
    })),
    ...logStore[ControlEvents.XHR_LOAD].map(xhrLog => ({
      ...xhrLog,
      type: "xhr",
    }))
  ].toSorted((a,b) => a.time.getTime() - b.time.getTime());
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
          logItems.map(logItem => `
            <li id="${logItem.id}">
              <div>${logItem.time}</div>
              <div>${logItem.type}</div>
              ${
                validateFetchLog(logItem)
                  ? `
                      <div>
                        ${logItem.data.init?.method ?? "GET"}
                      </div>
                      <div>
                        ${logItem.data.input}
                      </div>
                      <div>
                        ${logItem.data.init?.body ?? ""}
                      </div>
                      <div>
                        ${logItem.data.response}
                      </div>
                    `
                  : validateXhrLog(logItem)
                    ? `
                        <div>
                          ${logItem.data.method}
                        </div>
                        <div>
                          ${logItem.data.url}
                        </div>
                        <div>
                          ${logItem.data.requestBody ?? ""}
                        </div>
                        <div>
                          ${logItem.data.responseText}
                        </div>
                      `
                    : ""
              }
            </li>
          `).join("")
        }
      </ul>
    </div>
    <style>
    #${id} {
      display: grid;
      grid-template-rows: auto 1fr;
      max-height: 100%;

      > form {
       display: grid;
       justify-content: end;
      }

      > ul {
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        list-style-type: none;
        color: #eeeeee;
        overflow: auto;

        li.hidden {
          display: none;
        }
      }
    }
    </style>
  `;
}
