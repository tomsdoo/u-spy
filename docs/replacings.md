---
outline: deep
---

# Replacings

We can replace the text contents with `_spy.replaceText()`.

``` js
_spy.replaceText(
  s => s.replace(/textToBeReplaced/g, "textReplaced")
);
```

## text to HTML

``` js
_spy.replaceText(
  s => s.replace(
    /\b(https?:\/\/.*)\b/g, ($0) => `<a href="${$0}">${$0}</a>`
  )
);
```

## specification of the targets with a selector

``` js
_spy.replaceText(
  s => s.replace(
    /\b(https?:\/\/.*)\b/g, ($0) => `<a href="${$0}">${$0}</a>`
  ),
  ":not(a)"
);
```

