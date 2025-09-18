export async function template({
  id,
  titleText,
  optionValues,
  optionsCanBeRemoved,
}: {
  id: string;
  titleText: string;
  optionValues: string[];
  optionsCanBeRemoved: boolean;
}) {
  return `
  <form id="${id}">
    <p>${titleText}</p>
    <ul>
      ${optionValues
        .map(
          (optionValue) => `<li>
        <div>${optionValue}</div>
        <button type="button" class="choose-button" data-value="${optionValue}">load</button>
        <button type="button" class="remove-button ${optionsCanBeRemoved ? "" : "hidden"}" data-value="${optionValue}">remove</button>
      </li>`,
        )
        .join("")}
    </ul>
    <button type="button" class="cancel-button">cancel</button>
  </form>
  <style>
  #${id} {
    display: grid;
    gap: 8px;
    box-shadow: inset 0 0 1px;
    border-radius: 8px;
    padding: 16px;
    background: inherit;
    color: inherit;
    button {
      display: block;
      padding: 0.5em;
      border-radius: 8px;
      box-shadow: inset 0 0 1px;
      color: inherit;
      background: inherit;
      border: 0;
      cursor: pointer;
      &.hidden {
        display: none;
      }
    }
    ul {
      li {
        display: grid;
        grid-template-columns: 1fr repeat(2, max-content);
        align-items: center;
      }
    }
    .cancel-button {
      margin-left: auto;
    }
  }
  </style>
  `;
}
