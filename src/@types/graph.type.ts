export interface GraphData {
  nodes: GraphDataNode[];
  edges: GraphDataEdge[];
}

export interface GraphDataNode {
  id: string;
  label: string;
}

export interface GraphDataEdge {
  from: string | null;
  to: string | null;
  label: string | null;
}

export interface GraphNode {
  key: string;
  cx: number;
  cy: number;
  width: number;
  height: number;
  label?: string;
}

export interface GraphEdge {
  key: string;
  points: {
    x: number;
    y: number;
  }[];
  label?: {
    text: string;
    x: number;
    y: number;
  };
}

export type EdgeStyle = 'polyline' | 'curve';

export type NodeStyle = {
  width: number;
  height: number;
  svg: string;
};


export interface Translation {
  x: number;
  y: number;
}