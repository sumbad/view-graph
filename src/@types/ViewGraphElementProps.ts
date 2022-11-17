import { GraphData, EdgeStyle, NodeStyle, Callback } from './graph.type';

/**
 * @see https://github.com/dagrejs/dagre/wiki#configuring-the-layout
 */
export interface LayoutConfig {
  /** Direction for rank nodes. Can be TB, BT, LR, or RL, where T = top, B = bottom, L = left, and R = right. */
  rankdir: 'TB' | 'BT' | 'LR' | 'RL';
  /** Type of algorithm to assigns a rank to each node in the input graph. Possible values: network-simplex, tight-tree or longest-path */
  ranker: 'network-simplex' | 'tight-tree' | 'longest-path';
  /** Number of pixels between each rank in the layout. */
  ranksep: number;
}

export type ViewGraphElementProps = {
  data: GraphData;
  edgeStyle?: EdgeStyle;
  nodeStyle?: NodeStyle | NodeStyle[];
  callback?: Callback;
  css?: string;
  layoutConfig?: Partial<LayoutConfig>;
};
