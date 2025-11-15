export async function template({
  id,
  imageSrcs,
  shadowHostStyle,
}: {
  id: string;
  imageSrcs: string[];
  shadowHostStyle: string;
}) {
  return `
  <div id="${id}">
    <div class="image-container">
      ${imageSrcs.map(
        (image, imageIndex) => `
        <img src="${image}" class="${imageIndex === 0 ? "active" : "hidden"}" />
      `,
      ).join("")}
    </div>
  </div>
  <style>
  ${shadowHostStyle}
  #${id} {
    position: fixed;
    inset: 0;
    display: grid;
    justify-content: center;
    align-items: center;
    background: transparent;
    z-index: calc(infinity);

    .image-container {
      position: relative;
      width: 100vw;
      height: 100vh;

      img {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        opacity: 0.4;
        filter: grayscale(1);
        transition: opacity 2s, transform 0.5s, filter 2s;
        transform: scale(0.9);
        &.to-leave {
          transition: opacity 0.5s, transform 0.5s;
          opacity: 0;
          transform: rotateY(90deg) scale(1);
        }
        &.from-enter {
          transition: opacity 0.5s, transform 0.5s;
          opacity: 0;
          transform: rotateY(-90deg) scale(1);
        }
        &.active {
          transition: opacity 0.5s, transform 0.5s, filter 0.5s;
          opacity: 1;
          filter: grayscale(0.5);
          transform: rotateY(0deg) scale(1);
          &:hover {
            transition: opacity 0.5s, transform 0.5s, filter 0.2s;
            filter: grayscale(0);
          }
        }

        &.hidden {
          display: none;
          opacity: 0;
        }
      }
    }
  }
  </style>
  `;
}
