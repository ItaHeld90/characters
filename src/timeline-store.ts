import { v4 as newUUID } from 'uuid';

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

let recordedDrawings: Drawing[] = [];
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
    const firstTimelineNode = createTimelineNode(drawings, currTimelineNode);
    currTimelineNode = firstTimelineNode;

    timeline = {
        id: newUUID(),
        firstNode: firstTimelineNode,
        lastNode: firstTimelineNode,
    };
}

export function recordDrawings(drawings: Drawing[]) {
    recordedDrawings.push(...drawings);

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
    recordedDrawings = [];
}
