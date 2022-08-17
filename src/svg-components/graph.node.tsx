import { NG } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { ref, createRef, Ref } from 'lit-html/directives/ref.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { EdgeStyle, GraphEdge, GraphNode, NodeStyle, Callback, ToggleTooltip } from '../@types/graph.type';
import { GRAPH_NODE_DEFAULT_ID } from '../utils/graph.util';
import { renderNode } from '../utils/renderNode.directive';
import { edgeNode } from './edge.node';
import { nodeNode } from './node.node';

interface IGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];

  edgeStyle: EdgeStyle;
  nodeStyle: Map<string, NodeStyle>;

  transform: string;
  transition?: string;

  toggleTooltip: ToggleTooltip;

  callback?: Callback;
}

const Edge = edgeNode();
const Node = nodeNode();

export const graphNode = NG<IGraphProps>(function* (params) {
  const svgRef: Ref<SVGAElement> = createRef();

  let state: typeof params | undefined;
  let viewBox: string = `0 0 ${document.documentElement.clientWidth} ${document.documentElement.clientHeight}`;

  const updateViewBox = () => {
    if (svgRef.value != null) {
      // Get width/height of SVG element
      const svgSize = svgRef.value.getBBox({
        fill: true,
        markers: true,
        stroke: true,
      });

      if (svgSize.width > 0 && svgSize.height > 0) {
        viewBox = '0 0 ' + svgSize.width + ' ' + svgSize.height;

        this.next();
      }
    }
  };

  const io = new IntersectionObserver(updateViewBox, { root: document.documentElement, threshold: 0.0 });

  requestAnimationFrame(() => {
    io.observe(svgRef.value!);

    this.next();
  });

  try {
    const exceptKeys: (keyof typeof params)[] = ['transform'];
    while (true) {
      if (
        Object.keys(params).some((key) => !exceptKeys.includes(key as keyof typeof params) && !Object.is(params[key], (state ?? {})[key]))
      ) {
        state = params;
        requestAnimationFrame(updateViewBox);
      }

      const Nodes: Partial<SVGElement>[] = [];
      const NodesDefs: Partial<SVGDefsElement>[] = [];
      let Edges: Partial<SVGElement>[] = [];

      params.nodeStyle.forEach((it) => {
        NodesDefs.push(
          <g x="0" y="0" id={it.id ?? GRAPH_NODE_DEFAULT_ID}>
            {unsafeSVG(it.svg)}
          </g>
        );
      });

      params.nodes.forEach((value) => {
        // TODO: use spread
        Nodes.push(
          <Node
            toggleTooltip={params.toggleTooltip}
            key={value.key}
            cx={value.cx}
            cy={value.cy}
            height={value.height}
            width={value.width}
            label={value.label}
            styleId={value.styleId}
            clickByNode={params.callback?.onClickByNode}
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
            strokeWidth={3}
            markerScale={3}
            edgeStyle={params.edgeStyle}
            clickByEdge={params.callback?.onClickByEdge}
            enterEdge={params.callback?.onEnterEdge}
            leaveEdge={params.callback?.onLeaveEdge}
          />
        );
      });

      // TODO: move styles to adopted style sheet; add "cursor: grabbing" for active modification
      params = yield renderNode(
        <svg
          class="graph"
          ref={ref(svgRef)}
          viewBox={viewBox}
          style={css`
            /* clean-css ignore:start */
            transform: ${params.transform};
            transition: ${params.transition};
            /* clean-css ignore:end */
          `}
        >
          <defs>
            {NodesDefs}
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
        </svg>,
        this
      );
    }
  } finally {
    io.disconnect();
  }
});
