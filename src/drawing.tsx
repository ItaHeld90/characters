import React from 'react';

interface DrawingProps {
    drawingText: string;
    isPicked: boolean;
    onPick: () => void;
}

export function Drawing({ isPicked, onPick, drawingText }: DrawingProps) {
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
                style={{
                    padding: '20px 100px',
                    background: isPicked ? 'lightgreen' : 'lightgrey',
                    cursor: 'pointer',
                }}
                onClick={onPick}
            >
                <pre>{drawingText}</pre>
            </div>
        </div>
    );
}
