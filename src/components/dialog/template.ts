export function template(id: string, title: string) {
  return `
    <div id="${id}">
      <div>
        <h1>${title}</h1>
      </div>
    </div>
    <style>
    #${id} {
      position: fixed;
      display: grid;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      color: #eeeeee;
      background: rgb(0 0 0 / 80%);
      z-index: calc(infinity);

      > div {
        display: grid;
        background: rgb(0 0 0 / 90%);
      }
    }
    </style>
  `;
}
