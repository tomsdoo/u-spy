export function template(id: string) {
  return `
  <ul id="${id}">
    <style>
    #${id} {
      position: fixed;
      z-index: calc(Infinity);
      top: 10vh;
      left: 50%;
      transform: translate(-50%, 0);
      margin-block: 0;
      padding-inline: 0;
      list-style: none;

      li {
        background: rgb(0 0 0 / 80%);
        color: #ffffff;
        font-size: 16px;
        padding: 32px;
        border-radius: 8px;
        opacity: 0;
        list-style: none;
        cursor: pointer;

        pre {
          word-break: break-all;
          white-space: pre-wrap;
          margin-block: 0;
        }

        &.visible {
          opacity: 1;
        }
        transition: opacity 1s;

        &.copied {
          position: relative;
          cursor: default;

          &::before {
            position: absolute;
            content: "copied";
            top: 0;
            right: 0;
            display: block;
            padding: 1em;
            font-size: 0.8em;
            color: #ffff88;
          }
        }
      }
    }
    </style>
  </ul>
  `;
}
