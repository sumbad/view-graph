import { NG } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { GraphNode } from '../typings/graph.type';
import { renderNode } from '../utils/renderNode.directive';

export const nodeNode = NG<GraphNode>(function* (params) {
  while (true) {
    params = (yield renderNode(
      <g key={params.key} transform={'translate(' + (params.cx - params.width / 2) + ',' + (params.cy - params.height / 2) + ')'}>
        <use x="0" y="0" width={params.width} height={params.height} href="#graphNode" />

        <text
          x={params.width + 10}
          y="20"
          filter="url(#solid)"
          style={css`
            font-size: 1.2rem;
            color: #2e2e2e;
            font-weight: 500;
          `}
        >
          {params.label}
        </text>
      </g>,
      this
    )) as GraphNode; // TODO: fix return type
  }
});
