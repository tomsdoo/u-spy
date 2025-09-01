import type {
  ControlElement,
  ControlEvents,
} from "@/components/control-element";

export type FetchLog =
  ControlElement["logStore"][ControlEvents.FETCH] extends (infer T)[]
    ? T
    : never;
export type XhrLog =
  ControlElement["logStore"][ControlEvents.XHR_LOAD] extends (infer T)[]
    ? T
    : never;
export type BeaconLog =
  ControlElement["logStore"][ControlEvents.BEACON] extends (infer T)[]
    ? T
    : never;
export type WindowMessageLog =
  ControlElement["logStore"][ControlEvents.WINDOW_MESSAGE] extends (infer T)[]
    ? T
    : never;

export function validateFetchLog(
  logItem: ControlElement["logItems"] extends (infer T)[] ? T : never,
): logItem is FetchLog & { type: "fetch" } {
  return logItem.type === "fetch";
}
export function validateXhrLog(
  logItem: ControlElement["logItems"] extends (infer T)[] ? T : never,
): logItem is XhrLog & { type: "xhr" } {
  return logItem.type === "xhr";
}
export function validateBeaconLog(
  logItem: ControlElement["logItems"] extends (infer T)[] ? T : never,
): logItem is BeaconLog & { type: "beacon" } {
  return logItem.type === "beacon";
}
export function validateWindowMessageLog(
  logItem: ControlElement["logItems"] extends (infer T)[] ? T : never,
): logItem is WindowMessageLog & { type: "windowMessage" } {
  return logItem.type === "windowMessage";
}

function getUrl(url: RequestInfo | URL) {
  return typeof url === "string"
    ? url
    : url instanceof Request
      ? url.url
      : url.href;
}

function getHost(url: RequestInfo | URL) {
  try {
    return new URL(getUrl(url)).host;
  } catch {
    return url.toString();
  }
}

function getPath(url: RequestInfo | URL) {
  try {
    return new URL(getUrl(url)).pathname;
  } catch {
    return url.toString();
  }
}

export function transformLogItem(
  logItem: ControlElement["logItems"] extends (infer T)[] ? T : never,
): {
  method: string;
  url: string;
  host: string;
  path: string;
  body: string | Blob | FormData | BodyInit | null | undefined;
  response: string | Blob | Response;
} {
  if (validateFetchLog(logItem)) {
    return {
      method: logItem.data.init?.method ?? "GET",
      url: getUrl(logItem.data.input),
      host: getHost(logItem.data.input),
      path: getPath(logItem.data.input),
      body: logItem.data.init?.body,
      response: logItem.data.response,
    };
  }

  if (validateXhrLog(logItem)) {
    return {
      method: logItem.data.method,
      url: logItem.data.url,
      host: getHost(logItem.data.url),
      path: getPath(logItem.data.url),
      body: logItem.data.requestBody as string,
      response: logItem.data.responseText,
    };
  }

  if (validateBeaconLog(logItem)) {
    return {
      method: "",
      url: getUrl(logItem.data.url),
      host: getHost(logItem.data.url),
      path: getPath(logItem.data.url),
      body: logItem.data.data,
      response: "",
    };
  }

  if (validateWindowMessageLog(logItem)) {
    return {
      method: "",
      url: logItem.data.origin,
      host: logItem.data.origin,
      path: "",
      body:
        typeof logItem.data.data === "string"
          ? logItem.data.data
          : JSON.stringify(logItem.data.data),
      response: "",
    };
  }

  return {
    method: "",
    url: "",
    host: "",
    path: "",
    body: "",
    response: "",
  };
}
