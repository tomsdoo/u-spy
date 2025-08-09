---
outline: deep
---

# Getting started

1. load js
    - from CDN
      ``` html
      <script src="https://cdn.jsdelivr.net/npm/u-spy"></script>
      ```
    - or make a bookmarklet or some
      ``` js
      javascript: (() => {document.body.appendChild(document.createElement("script")).src = `https://cdn.jsdelivr.net/npm/u-spy`;})();
      ```

2. start intercepting
    - on your console
      ``` js
      _spy.intercept("hello-world");
      ```

3. ..and just type on the page
    - type `spy` to see the spy log dialog.
    - type `style` to see the ad hoc style editor.


## use a specific version

for example, for `v0.1.0` like below

``` html
<script src="https://cdn.jsdelivr.net/npm/u-spy@0.1.0"></script>
```

***

![npm](https://img.shields.io/npm/v/u-spy?style=for-the-badge&logo=npm)
![NPM](https://img.shields.io/npm/l/u-spy?style=for-the-badge&logo=npm)

![ci](https://img.shields.io/github/actions/workflow/status/tomsdoo/u-spy/ci.yml?style=social&logo=github)
![checks](https://img.shields.io/github/check-runs/tomsdoo/u-spy/main?style=social&logo=github)
![top language](https://img.shields.io/github/languages/top/tomsdoo/u-spy?style=social&logo=typescript)
![Maintenance](https://img.shields.io/maintenance/yes/2025?style=social&logo=github)

<style>
  p:has(img[src*="img.shields.io"]) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px 10px;
  }
</style>
