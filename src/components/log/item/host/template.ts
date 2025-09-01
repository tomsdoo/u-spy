export function template({
  id,
  url,
  host,
}: {
  id: string;
  url: string;
  host: string;
}) {
  const linkColor = "cornflowerblue";
  return `
  <div id="${id}" class="host">
    <abbr title="${url}">${host}</abbr>
    <a href="${url}" target="_blank">${url}</a>
  </div>
  <style>
  #${id} {
    > a {
      display: none;
      color: ${linkColor};
    }
    &.detailed {
      abbr {
        display: none;
      }
      > a {
        display: inline;
        color: ${linkColor};
      }
    }
  }
  </style>
  `;
}
