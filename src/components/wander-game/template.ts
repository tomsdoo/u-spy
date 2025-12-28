export async function template({
  id,
  shadowHostStyle,
}: {
  id: string;
  shadowHostStyle: string;
}) {
  return `<div id="${id}">
  <svg></svg>
  </div>
  <style>
  ${shadowHostStyle}
  @keyframes fade-circle-${id} {
    0% {
      r: 3;
    }
    40% {
      r: 6;
    }
    100% {
      r: 0;
    }
  }
  #${id} {
    position: fixed;
    inset: 0;
    display: grid;
    justify-content: center;
    align-items: center;
    background: rgb(0 0 0 / 85%);
    z-index: calc(infinity);
    > svg {
      width: 80vmin;
      height: 80vmin;
      .circle.fade {
        animation: 1s forwards fade-circle-${id};
      }
    }
  }
  </style>`;
}
