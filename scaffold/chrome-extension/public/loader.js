const scriptUrl = chrome.runtime.getURL("/index.iife.js");
const scriptTag = document.createElement("script");
scriptTag.src = scriptUrl;
document.body.appendChild(scriptTag);
