import { times, sample, chunk, initial, last } from 'lodash';

interface DrawingOptions {
    pSpace?: number;
}

export function getRandomDrawing(
    charSet: string[],
    numRows: number,
    wingLen: number,
    { pSpace = 0.5 }: DrawingOptions = {}
): string[] {
    const p = Math.min(pSpace, 1);

    const res: string[] = [];

    times(numRows, () => {
        times(wingLen + 1, () => {
            const rndChar =
                p > Math.random() ? ' ' : (sample(charSet) as string);
            res.push(rndChar);
        });
    });

    return res;
}

export function drawingToText(drawing: string[], wingLen: number): string {
    return chunk(drawing, wingLen + 1)
        .map((row) => {
            const middle = last(row);
            const leftWing = initial(row);
            const rightWing = [...leftWing].reverse();
            return [...leftWing, middle, ...rightWing].join('');
        })
        .join('\n');
}
