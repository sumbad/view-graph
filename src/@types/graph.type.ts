export interface GraphData {
  nodes: GraphDataNode[];
  edges: GraphDataEdge[];
}

export interface GraphDataNode {
  id: string;
  label: string;
  styleId?: string;
  info?: GraphDataNodeInfoItem[];
}

export interface GraphDataNodeInfoItem {
  key: string;
  value: string;
}

export interface GraphDataEdge {
  id: string;
  from: string | null;
  to: string | null;
  label?: string | null;
}

export interface GraphNode {
  key: string;
  cx: number;
  cy: number;
  width: number;
  height: number;
  label?: string;
  styleId?: string;
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
  id?: string;
  width: number;
  height: number;
  svg: string;
};

export interface Translation {
  x: number;
  y: number;
}

export type ToggleTooltip = (isVisible: boolean, nodeKey: string) => void;

export interface Callback {
  onClickByNode?: (nodeId: string) => ((event: MouseEvent) => void) | void;
  onClickByEdge?: (edgeId: string) => ((event: MouseEvent) => void) | void;
  onEnterEdge?: (edgeId: string) => ((event: MouseEvent) => void) | void;
  onLeaveEdge?: (edgeId: string) => ((event: MouseEvent) => void) | void;
}
