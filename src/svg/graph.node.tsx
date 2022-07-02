import { NG } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { ref, createRef, Ref } from 'lit-html/directives/ref.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { EdgeStyle, GraphEdge, GraphNode, NodeStyle } from '../typings/graph.type';
import { renderNode } from '../utils/renderNode.directive';
import { edgeNode } from './edge.node';
import { nodeNode } from './node.node';

interface IGraphProps {
  // width: number;
  // height: number;

  // tX: number;
  // tY: number;

  nodes: GraphNode[];
  edges: GraphEdge[];

  edgeStyle: EdgeStyle;
  nodeStyle: NodeStyle;

  transform: string;
  isCustomNavLib?: boolean;
}

const ZOOM_STEP = 0.03 as const;
const Edge = edgeNode();
const Node = nodeNode();

export const graphNode = NG<IGraphProps>(function* (params) {
  const svgRef: Ref<SVGAElement> = createRef();

  let state: typeof params | undefined;
  let viewBox: string = `0 0 ${document.documentElement.clientWidth} ${document.documentElement.clientHeight}`;

  const updateViewBox = () => {
    requestAnimationFrame(() => {
      if (svgRef.value != null) {
        // Get width/height of SVG element
        const svgSize = svgRef.value.getBBox({
          fill: true,
          markers: true,
          stroke: true,
        });

        viewBox = '0 0 ' + svgSize.width + ' ' + svgSize.height;

        this.next();
      }
    });
  };

  requestAnimationFrame(() => {
    this.next();
  });

  const exceptKeys: (keyof typeof params)[] = ['transform'];
  while (true) {
    if (
      Object.keys(params).some((key) => !exceptKeys.includes(key as keyof typeof params) && !Object.is(params[key], (state ?? {})[key]))
    ) {
      state = params;
      updateViewBox();
    }

    const Nodes: Partial<SVGElement>[] = [];
    let Edges: Partial<SVGElement>[] = [];

    params.nodes.forEach((value) => {
      // TODO: use spread
      Nodes.push(
        <Node
          key={value.key}
          cx={value.cx}
          cy={value.cy}
          height={value.height}
          width={value.width}
          label={value.label}
        />
      );
    });

    Edges = params.edges.map((value) => {
      return (
        // TODO: use spread
        <Edge
          key={value.key}
          points={value.points}
          label={value.label}
          stroke={'#A6A5A5'}
          strokeWidth={2}
          markerScale={3}
          edgeStyle={params.edgeStyle}
        />
      );
    });

    // TODO: move styles to adopted style sheet; add "cursor: grabbing" for active modification
    params = (yield renderNode(
      <svg
        id="graph"
        ref={ref(svgRef)}
        viewBox={viewBox}
        style={css`
          /* clean-css ignore:start */
          position: absolute;
          overflow: visible;
          top: 1%;
          left: 1%;
          width: 98%;
          height: 98%;

          transform-origin: 0px 0px;
          transform: ${params.transform};

          cursor: grab;
          user-select: none;
          /* clean-css ignore:end */
        `}
      >
        <g>
          <defs>
            <g x="0" y="0" id="graphNode">
              {unsafeSVG(params.nodeStyle.svg)}
            </g>
            <filter x="0" y="0" width="1" height="1" id="solid">
              <feFlood flood-color="white" result="bg" />
              <feMerge>
                <feMergeNode in="bg" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Edges}
          {Nodes}
        </g>
      </svg>,
      this
    )) as IGraphProps; // TODO: fix return type
  }
});
