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
            const rightWing = leftWing.map(mirrorChar).reverse();
            return [...leftWing, middle, ...rightWing].join('');
        })
        .join('\n');
}

export function mutateDrawing(drawing: string[], charSet: string[]): string[] {
    return drawing.map((char) => mutateChar(char, charSet));
}

export function mutateChar(char: string, charSet: string[]): string {
    if (Math.random() > 0.2) return char;

    return char === ' '
        ? mutateWhiteSpace(char, charSet)
        : Math.random() < 0.3
        ? ' '
        : (sample(charSet) as string);
}

export function mutateWhiteSpace(char: string, charSet: string[]): string {
    return Math.random() < 0.3 ? (sample(charSet) as string) : char;
}

function mirrorChar(char: string): string {
    switch (char) {
        case '/':
            return '\\';
        case '\\':
            return '/';
        case '[':
            return ']';
        case ']':
            return '[';
        case '<':
            return '>';
        case '>':
            return '<';
        case '{':
            return '}';
        case '}':
            return '{';
        case '(':
            return ')';
        case ')':
            return '(';
        default:
            return char;
    }
}
