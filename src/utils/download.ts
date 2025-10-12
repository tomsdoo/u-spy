export function download({
  data,
  filename,
}: {
  data: string | object;
  filename: string;
}) {
  const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob =
    typeof data === "string"
      ? new Blob([BOM, data], { type: "text/plain" })
      : new Blob([BOM, JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
  const url = URL.createObjectURL(blob);
  const anc = document.body.appendChild(document.createElement("a"));
  anc.setAttribute("download", filename);
  anc.setAttribute("href", url);
  anc.click();
  anc.remove();
}
