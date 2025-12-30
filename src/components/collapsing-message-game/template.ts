export async function template({
  id,
  shadowHostStyle,
}: {
  id: string;
  shadowHostStyle: string;
}) {
  return `<div id="${id}"></div>
  <style>
  ${shadowHostStyle}
  #${id} {
    position: fixed;
    inset: 0;
    display: grid;
    justify-content: center;
    align-items: center;
    background: rgb(0 0 0 / 85%);
    z-index: calc(infinity);
    > svg {
      width: 100vw;
      height: 100vh;
    }
  }
  </style>
  `;
}
