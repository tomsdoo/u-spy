const scriptUrl = chrome.extension.getURL("/index.global.js");
const scriptTag = document.createElement("script");
scriptTag.src = scriptUrl;
document.body.appendChild(scriptTag);
