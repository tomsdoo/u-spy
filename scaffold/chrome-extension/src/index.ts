import "u-spy";

_spy.stroke.register("hello", () => {
  _spy.showEphemeralMessage("world");
});
