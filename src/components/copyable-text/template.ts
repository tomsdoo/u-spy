export async function template({ id, textId }: { id: string; textId: string }) {
  return `
  <div id="${id}">
  </div>
  <style>
  #${id} {
    position: relative;
    &.copied::before {
      content: "copied";
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.2em 0.5em;
      color: darkkhaki;
      font-size: 12px;
      border-radius: 1em;
      background: rgb(0 0 0 / 10%);
      backdrop-filter: blur(1em);
    }
  }
  </style>
  `;
}
