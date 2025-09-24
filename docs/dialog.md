---
outline: deep
---

# Dialog

We can display a dialog with `_spy.dialog` interface.

## display dialog

We can display a dialog with `dialog.display()`.

``` js
const {
  close,
} = _spy.dialog.display(dialogElement => {
  const button = document.createElement("button");
  button.textContent = "world";
  button.addEventListener("click", close);
  dialogElement.appendChild(button);
}, {
  title: "hello",
});
```

