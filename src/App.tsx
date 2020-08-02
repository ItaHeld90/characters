import React, { useState } from 'react';
import './App.css';
import { getRandomDrawing, drawingToText } from './drawing-utils';

const charSet = ['+', '=', 'X', 'Y', 'o', 'O', 'H', '^', '.', '*', '8', '|'];
const numRows = 10;
const wingLen = 4;

function App() {
    const [drawing] = useState(
        getRandomDrawing(charSet, numRows, wingLen, { pSpace: 0.65 })
    );
    const str = drawingToText(drawing, wingLen);

    return (
        <div style={{ height: '100vh', fontSize: 20 }} className="App">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <pre>{str}</pre>
            </div>
        </div>
    );
}

export default App;
