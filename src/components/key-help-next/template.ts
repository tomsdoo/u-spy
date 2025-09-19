export async function template({
  id,
  keyDefinitionItems,
}: {
  id: string;
  keyDefinitionItems: {
    key: string;
    description: string;
  }[];
}) {
  return `
  <div id="${id}">
    <div>keys</div>
    <ul>
      ${keyDefinitionItems
        .map(
          ({ key, description }) => `
      <li>
        <div>${key}</div>
        <div>${description}</div>
      </li>`,
        )
        .join("")}
    </ul>
  </div>
  <style>
  #${id} {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    gap: 16px;
    min-width: 160px;
    min-height: 160px;
    max-width: 80vw;
    max-height: 80vh;
    padding: 16px 32px;
    border-radius: 8px;
    backdrop-filter: blur(16px);
    background: rgb(0 0 0 / 80%);
    box-shadow: inset 0 0 10px rgb(255 255 255 / 20%), inset 0 0 16px rgb(255 255 255 / 30%);
    > div {
      text-align: center;
    }
    > ul {
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
