// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export function shuffle(array: number[]): number[] {
    let a = JSON.parse(JSON.stringify(array))
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
export function range(start: number, end: number): number[] {
    return Array.from({ length: (end - start) }, (v, k) => k + start);
}