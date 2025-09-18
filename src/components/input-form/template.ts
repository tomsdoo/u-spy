export async function template({
  id,
  buttonCaption,
  cancelCaption,
  text,
}: {
  id: string;
  buttonCaption: string;
  cancelCaption: string;
  text: string;
}) {
  return `
  <form id="${id}" onsubmit="return false" tabindex="0">
    <div>${text}</div>
    <input type="text" />
    <ul>
      <li>
        <button type="button" class="ok-button">${buttonCaption}</button>
      </li>
      <li>
        <button type="button" class="cancel-button">${cancelCaption}</button>
      </li>
    </ul>
  </form>
  <style>
  #${id} {
    display: grid;
    grid-template-columns: 1fr;
    padding: 16px;
    border-radius: 8px;
    gap: 8px;
    box-shadow: inset 0 0 1px #ffffff;

    input {
      background: transparent;
      color: inherit;
      padding: 0.5em;
      box-shadow: inset 0 0 1px;
      border: 0;
    }

    ul {
      display: grid;
      grid-template-columns: repeat(2, max-content);
      justify-content: end;
      align-items: center;
    }

    button {
      background: transparent;
      color: inherit;
      box-shadow: inset 0 0 1px;
      border-radius: 8px;
      cursor: pointer;
      border: 0;
      padding: 0.2em 0.5em;
    }
  }
  </style>
  `;
}
