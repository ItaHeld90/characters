import { v4 as newUUID } from 'uuid';
import { keyBy } from 'lodash';
import { useState } from 'react';
import { modulo } from './helper-utils';

export type DrawingData = string[];

export interface Drawing {
    id: string;
    data: DrawingData;
}

interface TimelineNode {
    id: string;
    drawings: string[];
    prevNode: TimelineNode | null;
    nextNodes: TimelineNode[];
    picked?: string;
}

interface TimelineTree {
    id: string;
    firstNode: TimelineNode;
    lastNode: TimelineNode;
}

interface Timeline {
    timelineTree: TimelineTree;
    currTimelineNode: TimelineNode;
    recordedDrawings: { [drawingId: string]: Drawing };
}

export function useTimeline(drawings: Drawing[]) {
    const [timeline, setTimeline] = useState(createTimeline(drawings));

    const { timelineTree, currTimelineNode, recordedDrawings } = timeline;

    function isInPast(): boolean {
        return currTimelineNode.nextNodes.length > 0;
    }

    function getTimelineNodeDrawings(timelineNode: TimelineNode): Drawing[] {
        return timelineNode.drawings.map(
            (drawingId) => recordedDrawings[drawingId]
        );
    }

    function handlePick(pickedDrawing: Drawing, newDrawings: Drawing[]) {
        const updatedCurrTimelineNode = isInPast()
            ? createTimelineNode(
                  getTimelineNodeDrawings(currTimelineNode),
                  currTimelineNode.prevNode
              )
            : currTimelineNode;

        updatedCurrTimelineNode.picked = pickedDrawing.id;

        const newTimelineNode = createTimelineNode(
            newDrawings,
            updatedCurrTimelineNode
        );

        const newTimelineTree: TimelineTree =
            updatedCurrTimelineNode === timelineTree?.lastNode
                ? {
                      ...timelineTree,
                      lastNode: newTimelineNode,
                  }
                : timelineTree;

        setTimeline({
            timelineTree: newTimelineTree,
            currTimelineNode: newTimelineNode,
            recordedDrawings: {
                ...recordedDrawings,
                ...keyBy(newDrawings, (drawing) => drawing.id),
            },
        });
    }

    function reset(drawings: Drawing[]) {
        setTimeline(createTimeline(drawings));
    }

    function backInTime() {
        const targetTimelineNode = currTimelineNode?.prevNode ?? null;

        if (targetTimelineNode) {
            setTimeline({
                ...timeline,
                currTimelineNode: targetTimelineNode,
            });
        }
    }

    function forwardInTime() {
        const [targetTimelineNode] = currTimelineNode?.nextNodes ?? [];

        if (targetTimelineNode) {
            setTimeline({
                ...timeline,
                currTimelineNode: targetTimelineNode,
            });
        }
    }

    function nextForkInTime() {
        navigateToForkInTime(1);
    }

    function prevForkInTime() {
        navigateToForkInTime(-1);
    }

    function navigateToForkInTime(step: number) {
        const prev = currTimelineNode.prevNode;

        if (!prev) return;

        const numForks = prev.nextNodes.length;

        if (numForks <= 1) return;

        const currForkIdx = prev.nextNodes.findIndex(
            (node) => node === currTimelineNode
        );
        const nextForkIdx = modulo(currForkIdx + step, numForks);

        setTimeline({
            ...timeline,
            currTimelineNode: prev.nextNodes[nextForkIdx],
        });
    }

    const currDrawings = currTimelineNode.drawings.map(
        (drawingId) => recordedDrawings[drawingId]
    );

    const currPicked = currTimelineNode.picked
        ? recordedDrawings[currTimelineNode.picked]
        : null;

    return {
        currDrawings,
        currPicked,
        handlePick,
        backInTime,
        forwardInTime,
        nextForkInTime,
        prevForkInTime,
        reset,
    };
}

function createTimeline(drawings: Drawing[]): Timeline {
    const recordedDrawings = keyBy(drawings, (drawing) => drawing.id);
    const currTimelineNode = createTimelineNode(drawings, null);
    const timelineTree = {
        id: newUUID(),
        firstNode: currTimelineNode,
        lastNode: currTimelineNode,
    };

    return {
        timelineTree,
        currTimelineNode,
        recordedDrawings,
    };
}

function createTimelineNode(
    drawings: Drawing[],
    prevNode: TimelineNode | null
): TimelineNode {
    const newNode: TimelineNode = {
        id: newUUID(),
        drawings: drawings.map((drawing) => drawing.id),
        prevNode,
        nextNodes: [],
    };

    newNode.prevNode?.nextNodes.push(newNode);

    return newNode;
}
