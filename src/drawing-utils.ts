import { times, sample, chunk, initial, last } from 'lodash';
import { Drawing, DrawingData } from './timeline-store';
import { v4 as newUUID } from 'uuid';

interface DrawingOptions {
    pSpace?: number;
}

export function getRandomDrawing(
    charSet: string[],
    numRows: number,
    wingLen: number,
    { pSpace = 0.5 }: DrawingOptions = {}
): Drawing {
    const p = Math.min(pSpace, 1);

    const drawingData: string[] = [];

    times(numRows, () => {
        times(wingLen + 1, () => {
            const rndChar =
                p > Math.random() ? ' ' : (sample(charSet) as string);
            drawingData.push(rndChar);
        });
    });

    return createNewDrawing(drawingData);
}

export function createNewDrawing(data: DrawingData): Drawing {
    return {
        id: newUUID(),
        data,
    };
}

export function drawingToText({ data }: Drawing, wingLen: number): string {
    return chunk(data, wingLen + 1)
        .map((row) => {
            const middle = last(row);
            const leftWing = initial(row);
            const rightWing = leftWing.map(mirrorChar).reverse();
            return [...leftWing, middle, ...rightWing].join('');
        })
        .join('\n');
}

export function mutateDrawing(
    data: DrawingData,
    charSet: string[]
): DrawingData {
    return data.map((char) => mutateChar(char, charSet));
}

export function mutateChar(char: string, charSet: string[]): string {
    if (Math.random() > 0.15) return char;

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
