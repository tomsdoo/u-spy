import "u-spy";

const {
  receiver,
  restore,
} = _spy.intercept("my-extension");

receiver.on(
  receiver.events.FETCH,
  (data) => {
    console.log("fetch", data);
  },
);

receiver.on(
  receiver.events.XHR_LOAD,
  (data) => {
    console.log("xhr load", data);
  },
);

receiver.on(
  receiver.events.BEACON,
  (data) => {
    console.log("beacon", data);
  },
);

receiver.on(
  receiver.events.WINDOW_MESSAGE,
  (data) => {
    console.log("window message", data);
  },
);

_spy.stroke.register("restore", () => {
  restore();
  _spy.showEphemeralMessage("restored interceptions");
});

_spy.stroke.register("hello", () => {
  _spy.dialog.display((dialogElement) => {
    const div = document.createElement("div");
    div.textContent = "world";
    dialogElement.appendChild(div);
  });
});
