import React from 'react';

import './drawing.css';

interface DrawingProps {
    drawingText: string;
    isPicked: boolean;
    onPick: () => void;
}

export function Drawing({ isPicked, onPick, drawingText }: DrawingProps) {
    function handleCopy(e: React.MouseEvent) {
        e.stopPropagation();
        return navigator.clipboard.writeText(drawingText);
    }

    return (
        <div
            style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                className="drawing-container"
                style={{
                    padding: '20px 100px',
                    background: isPicked ? 'lightgreen' : 'lightgrey',
                    cursor: 'pointer',
                    position: 'relative',
                }}
                onClick={onPick}
            >
                <pre>{drawingText}</pre>
                <div
                    className="drawing-actions-bar"
                    style={{
                        position: 'absolute',
                        padding: 5,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <button style={{ cursor: 'pointer' }} onClick={handleCopy}>
                        copy
                    </button>
                </div>
            </div>
        </div>
    );
}
