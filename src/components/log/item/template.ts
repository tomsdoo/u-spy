import { ControlElement } from "@/components/control-element";
import {
  transformLogItem,
} from "@/components/log/list/util";
import { LogItemHostElement } from "@/components/log/item/host";
import { UtilsElement } from "@/components/utils";
import { CopyableTextElement } from "@/components/copyable-text";

export async function template(
  {
    id,
    controlId,
    logId,
    logItem,
  }: {
    id: string;
    controlId: string;
    logId: string;
    logItem: (ControlElement["logItems"] extends (infer T)[] ? T : never) | null;
  }
) {
  const { formatTime } = UtilsElement.ensure();

  if (logItem == null) {
    return ``;
  }

  const {
    method,
    url,
    host,
    body: rawBody,
    response: rawResponse,
  } = transformLogItem(logItem);
  const body = await (async () => {
    if (rawBody == null) {
      return null;
    }
    if (rawBody instanceof Blob) {
      return await new Response(rawBody).text();
    } else if (rawBody instanceof FormData) {
      return JSON.stringify(Object.fromEntries(rawBody.entries()));
    }
    return rawBody;
  })();
  const response = await (async () => {
    if (rawResponse == null) {
      return null;
    }
    if (rawResponse instanceof Response) {
      return await rawResponse.clone().text();
    }
    return rawResponse;
  })();
  const itemText = [
    logItem.type,
    method,
    url,
    body,
    response,
  ].join(" ");
  return `
  <li id="${id}">
    <div>
      <div>
        <div class="time">${formatTime(logItem.time)}</div>
        <div class="type">${logItem.type}</div>
        <div class="method">${method}</div>
      </div>
      <${LogItemHostElement.TAG_NAME}
        host=${JSON.stringify(host)}
        url=${JSON.stringify(url)}
      ></${LogItemHostElement.TAG_NAME}>
    </div>
    <div data-foldable class="body folded">
      <div class="copyable">
        ${body == null ? '' : body}
      </div>
      <button>expand</button>
    </div>
    <div data-foldable class="response folded">
      <div class="copyable">
        ${response == null ? '' : response}
      </div>
      <button>expand</button>
    </div>
    <div data-item-text>${itemText}</div>
  </li>
  <style>
  #${id} {
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
    }
    > .body {
      font-size: inherit;
      text-align: left;
      &:empty {
        display: none;
      }
    }
    > .response {
      font-size: inherit;
      text-align: left;
      &:empty {
        display: none;
      }
    }
    > [data-foldable] {
      position: relative;

      > button {
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        display: grid;
        padding: 0.2em 0.5em;
        font-size: 12px;
        backdrop-filter: blur(1em);
        background: rgb(0 0 0 / 10%);
        color: darkkhaki;
        border: 0;
        border-radius: 1em;
      }
    }
    > .folded {
      overflow: hidden;
      max-height: calc(1.5em * 2);
    }
    > [data-item-text] {
      display: none;
    }
    .copyable {
      position: relative;
      &.copied {
        &::before {
          content: "copied!";
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.2em 0.5em;
          color: darkkhaki;
          font-size: 12px;
          border-radius: 1em;
          background: rgb(0 0 0 / 10%);
          backdrop-filter: blur(1em);
        }
      }
    }
  }
  </style>
  `;
}
