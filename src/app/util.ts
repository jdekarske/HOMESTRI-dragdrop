// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export function shuffle(array: number[]): number[] {
  const a = JSON.parse(JSON.stringify(array));
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
export function range(start: number, end: number): number[] {
  return Array.from({ length: (end - start) }, (v, k) => k + start);
}

export function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj))}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function getFormattedTime() {
  const today = new Date();
  const y = today.getFullYear();
  // JavaScript months are 0-based.
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const h = today.getHours();
  const mi = today.getMinutes();
  const s = today.getSeconds();
  return `${y}-${m}-${d}-${h}-${mi}-${s}`;
}
