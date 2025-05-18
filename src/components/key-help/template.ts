export function template(id: string) {
  return `
  <div id="${id}" class="hidden" tabindex="-1">
    <div>keys</div>
    <ul></ul>
  </div>
  <style>
  #${id} {
    &.hidden {
      display: none;
    }
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    display: grid;
    grid-template:
      "title" auto
      "content" 1fr;
    gap: 16px;
    min-width: 10rem;
    min-height: 10rem;
    max-width: 80%;
    max-height: 80%;
    padding: 16px 32px;
    border-radius: 8px;
    backdrop-filter: blur(1em);
    background: rgb(0 0 0 / 80%);
    box-shadow: inset 0 0 10px rgb(255 255 255 / 20%), inset 0 0 16px rgb(255 255 255 / 30%);
    transform: translate(-50%, -50%);
    > div {
      grid-area: title;
      text-align: center;
    }
    > ul {
      grid-area: content;
      > li {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 16px;
      }
    }
  }
  </style>
  `;
}
