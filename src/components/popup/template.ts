export function template(id: string) {
  return `
  <div id="${id}">
  </div>
  <style>
  #${id} {
    position: fixed;
    z-index: calc(Infinity);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(0 0 0 / 80%);
    color: #ffffff;
    font-size: 16px;
    padding: 32px;
    border-radius: 8px;
    opacity: 0;

    &.visible {
      opacity: 1;
    }
    transition: opacity 1s;
  }
  </style>
  `;
}
