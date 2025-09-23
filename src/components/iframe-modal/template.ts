export async function template({ id, src }: { id: string; src: string }) {
  return `
  <div id="${id}">
    <iframe src="${src}"></iframe>
  </div>
  <style>
  #${id} {
    position: fixed;
    inset: 0;
    display: grid;
    justify-content: center;
    align-items: center;
    background: rgb(0 0 0 /80%);
    z-index: calc(infinity);
    > iframe {
      width: 80vw;
      height: 80vh;
      border: none;
      box-shadow: 0 0 1px;
    }
  }
  </style>
  `;
}
