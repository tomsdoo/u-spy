import "u-spy";

_spy.stroke.register("hello", () => {
  _spy.showEphemeralMessage("world");
});

_spy.stroke.register("dialog", () => {
  _spy.dialog.display((dialogElement) => {
    const div = document.createElement("div");
    div.textContent = "hello from dialog";
    dialogElement.appendChild(div);
  });
});
