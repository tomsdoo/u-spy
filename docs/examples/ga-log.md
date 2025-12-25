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

_spy.customElement.ensureTemplateView();
_spy.stroke.register("galog", () => {
  _spy.dialog.display((dialogElement) => {
		dialogElement.appendChild(
			document.createRange().createContextualFragment(`
				<template-view>
					<div class="wrapper">
						<ul class="tracking-id-list">
							<li :for="trackingIds">
								<button type="button" @click="selectTrackingId" :text="."></button>
							</li>
						</ul>
						<p class="title" :text="currentTrackingId"></p>
						<ul class="log-list">
							<li :for="currentTrackingLogRecords">
								<div class="log-item">
									<div class="time" :text="formattedTime"></div>
									<div class="log" :text="logStr" @click="copyLogToClipboard"></div>
								</div>
							</li>
						</ul>
					</div>
					<style>
					ul {
						list-style: none;
						padding: 0;
						margin: 0;
					}
					.wrapper {
						display: grid;
						gap: 16px;

						.title {
							text-align: center;
							margin: 0;
						}
						.tracking-id-list {
							display: flex;
							flex-direction: row;
							gap: 16px;

							button {
								cursor: pointer;
								padding: 8px 16px;
								border: none;
								box-shadow: 0 0 1px;
								color: inherit;
								background: transparent;
							}
						}
						.log-item {
							display: grid;
							grid-template-columns: auto 1fr;
							gap: 16px;
							.time {
								white-space: nowrap;
							}
							.log {
								word-break: break-all;
								text-align: left;
								cursor: pointer;
								position: relative;
							}
							.log.copied::after {
								content: "copied";
								position: absolute;
								top: 0;
								right: 0;
								color: yellow;
							}
						}
					}
					</style>
				</template-view>
			`)
		);
		const tvItem ={
			trackingIds: gaLogReader.trackingIds,
			currentTrackingId: "",
			currentTrackingLogRecords: [],
		};
		const tvElement = dialogElement.querySelector("template-view");
		tvElement.item = tvItem;
		tvElement.reducers = [
			(item) => {
				const currentTrackingId = item.currentTrackingId || item.trackingIds[0] || "";
				return {
					...item,
					currentTrackingId,
					currentTrackingLogRecords: gaLogReader[currentTrackingId] ?? [],
				};
			},
		];
		tvElement.eventHandlers = {
			selectTrackingId(e, item, wholeItem, reflux) {
				reflux({
					...wholeItem,
					currentTrackingId: item,
				});
			},
			async copyLogToClipboard(e, item) {
				const target = e.target;
				await navigator.clipboard.writeText(item.logStr);
				target.classList.add("copied");
				await new Promise(resolve => setTimeout(resolve, 1000));
				target.classList.remove("copied");
			},
		};
  }, { title: "ga log" });
});

```

