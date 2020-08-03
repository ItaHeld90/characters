import React, { useState } from 'react';
import { times } from 'lodash';
import {
    getRandomDrawing,
    drawingToText,
    mutateDrawing,
} from './drawing-utils';
import './App.css';

const fontSize = 20;

const charSet = ['^', '/', '\\', '^', '*', 'o', 'O', '{', '}', '_', '-', '='];
const numRows = 12;
const wingLen = 4;
const pSpace = 0.75;

const numDrawings = 6;
const numTileRows = 2;
const numCols = Math.floor(numDrawings / numTileRows);

function App() {
    const [drawings, setDrawings] = useState(getInitDrawings());

    function getInitDrawings() {
        return times(numDrawings, () =>
            getRandomDrawing(charSet, numRows, wingLen, { pSpace })
        );
    }

    function handlePick(drawingIdx: number) {
        const picked = drawings[drawingIdx];
        const newDrawings = times(numDrawings - 1, () =>
            mutateDrawing(picked, charSet)
        );

        const updatedDrawings = [
            ...newDrawings.slice(0, drawingIdx),
            picked,
            ...newDrawings.slice(drawingIdx),
        ];

        setDrawings(updatedDrawings);
    }

    const strings = drawings.map((drawing) => drawingToText(drawing, wingLen));

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
                    <button onClick={() => setDrawings(getInitDrawings())}>
                        Refresh
                    </button>
                </div>
                {times(numTileRows, (rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex', flex: 1 }}>
                        {times(numCols, (colIdx) => (
                            <div
                                key={colIdx} // TODO: use id
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '20px 100px',
                                        background: 'lightgrey',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        handlePick(colIdx + rowIdx * numCols)
                                    }
                                >
                                    <pre>
                                        {strings[colIdx + rowIdx * numCols]}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
