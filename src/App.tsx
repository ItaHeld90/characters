import React, { useRef } from 'react';
import { times } from 'lodash';
import html2canvas from 'html2canvas';
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

const charSet = ['d', 'b', '|', '\\', '/', '.', '=', '{', '}', '*', '^', '<', '>', 'o', 'O']
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
    const drawingsContainerRef = useRef<HTMLDivElement>(null);

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

    async function handleDownloadImage() {
        const drawingsContainer = drawingsContainerRef.current;

        if (!drawingsContainer) return;

        const fileName = prompt('Please enter the file name:', 'characters');

        if (!fileName) return;

        const canvasEl = await html2canvas(drawingsContainer);

        const dataUrl = canvasEl.toDataURL('jpg');
        const link = document.createElement('a');
        link.download = `${fileName}.jpg`;
        link.href = dataUrl;

        link.click();
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
                    <button onClick={prevForkInTime}>prev fork</button>
                    <button onClick={nextForkInTime}>next fork</button>
                    <button onClick={backInTime}>Back</button>
                    <button onClick={forwardInTime}>Forward</button>
                    <button onClick={handleDownloadImage}>
                        Download as image
                    </button>
                </div>
                <div
                    ref={drawingsContainerRef}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {times(numTileRows, (rowIdx) => (
                        <div key={rowIdx} style={{ display: 'flex', flex: 1 }}>
                            {times(numCols, (colIdx) => (
                                <Drawing
                                    key={
                                        drawings[
                                            coordinatesToDrawingIdx(
                                                rowIdx,
                                                colIdx
                                            )
                                        ].id
                                    }
                                    drawingText={
                                        texts[
                                            coordinatesToDrawingIdx(
                                                rowIdx,
                                                colIdx
                                            )
                                        ]
                                    }
                                    isPicked={
                                        drawings[
                                            coordinatesToDrawingIdx(
                                                rowIdx,
                                                colIdx
                                            )
                                        ] === currPicked
                                    }
                                    onPick={() =>
                                        handleClickOnDrawing(
                                            coordinatesToDrawingIdx(
                                                rowIdx,
                                                colIdx
                                            )
                                        )
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
