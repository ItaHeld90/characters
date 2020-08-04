import { v4 as newUUID } from 'uuid';
import { keyBy } from 'lodash';

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

interface Timeline {
    id: string;
    firstNode: TimelineNode;
    lastNode: TimelineNode;
}

let recordedDrawings: { [drawingId: string]: Drawing } = {};
let timeline: Timeline | null = null;
let currTimelineNode: TimelineNode | null = null;

function createTimelineNode(
    drawings: Drawing[],
    prevNode: TimelineNode | null
): TimelineNode {
    return {
        id: newUUID(),
        drawings: drawings.map((drawing) => drawing.id),
        prevNode,
        nextNodes: [],
    };
}

export function initTimeline(drawings: Drawing[]) {
    recordedDrawings = keyBy(drawings, (drawing) => drawing.id);
    const firstTimelineNode = createTimelineNode(drawings, currTimelineNode);
    currTimelineNode = firstTimelineNode;

    timeline = {
        id: newUUID(),
        firstNode: firstTimelineNode,
        lastNode: firstTimelineNode,
    };
}

export function recordDrawings(drawings: Drawing[]) {
    recordedDrawings = {
        ...recordedDrawings,
        ...keyBy(drawings, (drawing) => drawing.id),
    };

    const newTimelineNode = createTimelineNode(drawings, currTimelineNode);

    if (currTimelineNode === timeline?.lastNode) {
        timeline.lastNode = newTimelineNode;
    }

    if (currTimelineNode) {
        currTimelineNode.nextNodes.push(newTimelineNode);
    }

    currTimelineNode = newTimelineNode;
}

export function recordPick(pickedDrawing: Drawing) {
    if (currTimelineNode) {
        currTimelineNode.picked = pickedDrawing.id;
    }
}

export function clearTimeline() {
    timeline = null;
    currTimelineNode = null;
    recordedDrawings = {};
}

export function backInTime(): Drawing[] | null {
    const targetTimelineNode = currTimelineNode?.prevNode ?? null;

    if (!targetTimelineNode) return null;

    currTimelineNode = targetTimelineNode;

    return currTimelineNode.drawings.map(
        (drawingId) => recordedDrawings[drawingId]
    );
}

export function forwardInTime(): Drawing[] | null {
    const [targetTimelineNode] = currTimelineNode?.nextNodes ?? [];

    if (!targetTimelineNode) return null;

    currTimelineNode = targetTimelineNode;

    return currTimelineNode.drawings.map(
        (drawingId) => recordedDrawings[drawingId]
    );
}
