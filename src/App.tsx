import React from 'react';
import { times } from 'lodash';
import {
    getRandomDrawing,
    drawingToText,
    createNewDrawing,
    mutateDrawing,
} from './drawing-utils';
import './App.css';
import { useTimeline } from './timeline-store';
import { Drawing } from './drawing';

const fontSize = 20;

const charSet = [
    '^',
    '/',
    '\\',
    '|',
    '^',
    '*',
    'o',
    'O',
    '{',
    '}',
    '_',
    '-',
    '=',
    '<',
    '>',
];
const numRows = 10;
const wingLen = 4;
const pSpace = 0.75;

const numDrawings = 6;
const numTileRows = 2;
const numCols = Math.floor(numDrawings / numTileRows);

// init
const initialDrawings = getNewDrawings();

function getNewDrawings() {
    return times(numDrawings, () =>
        getRandomDrawing(charSet, numRows, wingLen, { pSpace })
    );
}

function App() {
    const {
        currDrawings: drawings,
        currPicked,
        handlePick,
        backInTime,
        forwardInTime,
        nextForkInTime,
        prevForkInTime,
        reset,
    } = useTimeline(initialDrawings);

    function handleReset() {
        const newDrawings = getNewDrawings();
        reset(newDrawings);
    }

    function handleClickOnDrawing(drawingIdx: number) {
        const picked = drawings[drawingIdx];
        const newDrawings = times(numDrawings - 1, () =>
            createNewDrawing(mutateDrawing(picked.data, charSet))
        );

        const updatedDrawings = [
            ...newDrawings.slice(0, drawingIdx),
            picked,
            ...newDrawings.slice(drawingIdx),
        ];

        handlePick(picked, updatedDrawings);
    }

    function coordinatesToDrawingIdx(rowIdx: number, colIdx: number) {
        return colIdx + rowIdx * numCols;
    }

    const texts = drawings.map((drawing) => drawingToText(drawing, wingLen));

    return (
        <div style={{ height: '100vh', fontSize }} className="App">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div>
                    <button onClick={handleReset}>Refresh</button>
                    <button onClick={backInTime}>Back</button>
                    <button onClick={forwardInTime}>Forward</button>
                    <button onClick={prevForkInTime}>prev fork</button>
                    <button onClick={nextForkInTime}>next fork</button>
                </div>
                {times(numTileRows, (rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex', flex: 1 }}>
                        {times(numCols, (colIdx) => (
                            <Drawing
                                key={
                                    drawings[
                                        coordinatesToDrawingIdx(rowIdx, colIdx)
                                    ].id
                                }
                                drawingText={
                                    texts[
                                        coordinatesToDrawingIdx(rowIdx, colIdx)
                                    ]
                                }
                                isPicked={
                                    drawings[
                                        coordinatesToDrawingIdx(rowIdx, colIdx)
                                    ] === currPicked
                                }
                                onPick={() =>
                                    handleClickOnDrawing(
                                        coordinatesToDrawingIdx(rowIdx, colIdx)
                                    )
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
