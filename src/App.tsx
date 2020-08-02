import React, { useState } from 'react';
import { times } from 'lodash';
import { getRandomDrawing, drawingToText } from './drawing-utils';
import './App.css';

const charSet = ['+', '=', 'X', 'Y', 'o', 'O', 'H', '^', '.', '*', '8', '|'];
const numRows = 10;
const wingLen = 4;

const numDrawings = 6;
const numTileRows = 2;
const numCols = Math.floor(numDrawings / numTileRows);

function App() {
    const [drawings] = useState(
        times(numDrawings, () =>
            getRandomDrawing(charSet, numRows, wingLen, { pSpace: 0.65 })
        )
    );

    const strings = drawings.map((drawing) => drawingToText(drawing, wingLen));

    return (
        <div style={{ height: '100vh', fontSize: 20 }} className="App">
            <div
                style={{
                    display: 'flex',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
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
                                        cursor: 'pointer'
                                    }}
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
