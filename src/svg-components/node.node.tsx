import { NG } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { Callback, GraphNode, ToggleTooltip } from '../@types/graph.type';
import { GRAPH_NODE_DEFAULT_ID } from '../utils/graph.util';
import { renderNode } from '../utils/renderNode.directive';

interface NodeProp extends GraphNode {
  toggleTooltip: ToggleTooltip;
  clickByNode?: Callback['onClickByNode'];
}

export const nodeNode = NG<NodeProp>(function* (params) {
  let isEntered = false;

  const onMouseEnter = () => {
    isEntered = true;
    setTimeout(() => {
      isEntered && params.toggleTooltip(isEntered, params.key);
    }, 700);
  };

  const onMouseLeave = () => {
    isEntered = false;
    params.toggleTooltip(isEntered, params.key);
  };

  while (true) {
    params = yield renderNode(
      <g
        id={params.key}
        transform={'translate(' + (params.cx - params.width / 2) + ',' + (params.cy - params.height / 2) + ')'}
        onmouseenter={onMouseEnter}
        onmouseleave={onMouseLeave}
        onclick={params.clickByNode}
      >
        <rect x="0" y="0" width={params.width} height={params.height} opacity="0"></rect>
        <use x="0" y="0" width={params.width} height={params.height} href={`#${params.styleId ?? GRAPH_NODE_DEFAULT_ID}`} />
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
    );
  }
});
