---
outline: deep
---

# GA log list

Let's make a GA log list dialog that will be shown by stroke `"galog"`.

``` js
const CONTROL_ID = 'ga-log';
const {
  receiver,
  restore,
} = _spy.intercept(CONTROL_ID);

const logTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour12: false,
  hour:   '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

const gaLogs = {};
const gaLogReader = new Proxy({}, {
  get(target, prop) {
    if (prop === "trackingIds") {
      return Array.from(Object.keys(gaLogs));
    }
    return (gaLogs[prop] ?? []).map(logItem => ({
      ...logItem,
      formattedTime: logTimeFormatter.format(new Date(logItem.time)),
      logStr: JSON.stringify(logItem.log),
    }));
  },
  set() {
    throw new Error("setter is not available");
  }
});

function addGaLog(log) {
  if (log.tid in gaLogs === false) {
    gaLogs[log.tid] = [];
  }
  gaLogs[log.tid].push({
    log: setupGaLog(log),
    time: Date.now(),
  });
}
function setupGaLog(log) {
  function replaceKey(key) {
    switch(key) {
      case "tid":
        return "trackingId";
      case "dt":
        return "title";
      case "en":
        return "eventName";
      default:
        break;
    }
    if (/^epn\./.test(key)) {
      return key.replace(/^epn\./, "");
    }
    return key;
  }
  return Object.fromEntries(
    Object.entries(log).map(([key,value]) => [replaceKey(key), value])
  );
}
function interpretGaLog(url, body) {
  return [
    () => Object.fromEntries(new URL(url).searchParams.entries()),
    () => Object.fromEntries(
      new URLSearchParams(decodeURIComponent(body)).entries(),
    ),
  ].reduce((acc, factory) => {
    const obj = (() => {
      try { return factory(); } catch { return {}; }
    })();
    return {
      ...acc,
      ...obj,
    };
  }, {});
}

function isUrlGa(url) {
  return /google/i.test(url) && /collect/i.test(url);
}

receiver.on(receiver.events.XHR_LOAD, (data) => {
  if(isUrlGa(data.url) === false) {
    return;
  }
  addGaLog(interpretGaLog(data.url, data.requestBody));
});

receiver.on(receiver.events.FETCH, (data) => {
  if(isUrlGa(data.input) === false) {
    return;
  }
  addGaLog(interpretGaLog(data.input, data.init.body));
});

receiver.on(receiver.events.BEACON, (data) => {
  if (isUrlGa(data.url) === false) {
    return;
  }
  addGaLog(interpretGaLog(data.url, data.data));
});

const keyMap = new Map();
function createClickTrackingIdEventName() {
  const clickTrackingIdEventName =
    `click_tracking_id_${crypto.randomUUID()}`;
  keyMap.set("click-tracking-id-event", clickTrackingIdEventName);
  return clickTrackingIdEventName;
}
function getClickTrackingIdEventName() {
  return keyMap.get("click-tracking-id-event");
}
_spy.stroke.register("galog", () => {
  _spy.customElement.ensureIterator();
  _spy.customElement.ensure("ga-log-item", {
    templateHtml: `
    <div class="log-item">
      <div :value="formattedTime"></div>
      <div :value="logStr" @click="onClick"></div>
    </div>
    <style>
    .log-item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 16px;
      div:nth-of-type(2) {
        word-break: break-all;
        text-align: left;
      }
    }
    :host(.copied) {
      .log-item {
        div:nth-of-type(2) {
          position: relative;
          &::before {
            position: absolute;
            top: 0;
            right: 0;
            content: "copied";
            color: yellow;
          }
        }
      }
    }
    </style>
    `,
    eventHandlers: {
      async onClick(e, { logStr }) {
        await navigator.clipboard.writeText(logStr);
        e.target.classList.add("copied");
        await new Promise(resolve => setTimeout(resolve, 1000));
        e.target.classList.remove("copied");
      },
    },
  });
  _spy.customElement.ensure("ga-tracking-id-button", {
    templateHtml: `
    <button
      class="tracking-id-button"
      type="button"
      @click="onClick"
      :value="trackingId"
    ></button>
    <style>
    .tracking-id-button {
      background: transparent;
      padding: 0.5em 1em;
      border: 0;
      display: grid;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0 0 1px;
      border-radius: 0.5em;
      color: inherit;
      cursor: pointer;
    }
    </style>
    `,
    eventHandlers: {
      onClick(e, item) {
        e.stopPropagation();
        _spy.eventBus.emit(getClickTrackingIdEventName(), item);
      },
    },
  });
  _spy.dialog.display((dialogElement) => {
    dialogElement.appendChild(
      document.createRange().createContextualFragment(`
        <div class="wrapper">
          <custom-iterator class="tracking-id-buttons" items="[]">
            <ga-tracking-id-button></ga-tracking-id-button>
          </custom-iterator>
          <p class="title"></p>
          <custom-iterator class="log-list">
            <ga-log-item />
          </custom-iteratpr>
          <div class="log-list-area"></div>
          <style>
          .wrapper {
            display: grid;
            gap: 16px;

            .title {
              text-align: center;
            }
            .tracking-id-buttons {
              display: flex;
              flex-direction: row;
              gap: 16px;
            }
          }
          </style>
        </div>
      `)
    );
    dialogElement.querySelector(".wrapper .tracking-id-buttons").items =
      gaLogReader.trackingIds.map(trackingId => ({ trackingId }));

    _spy.eventBus.on(
      getClickTrackingIdEventName(),
      async ({ trackingId }) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        dialogElement.querySelector(".wrapper .title").textContent =
          trackingId;
        dialogElement.querySelector(".wrapper .log-list").items =
          gaLogReader[trackingId];
      }
    );
  }, { title: "ga log" });
});

```

