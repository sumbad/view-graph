import { NG } from '@web-companions/gfc';
import { Callback, GraphNode, ToggleTooltip } from '../@types/graph.type';
import { GRAPH_NODE_DEFAULT_ID } from '../utils/graph.util';
import { renderNode } from '../utils/renderNode.directive';

interface NodeProp extends GraphNode {
  toggleTooltip: ToggleTooltip;
  clickByNode?: Callback['onClickByNode'];
  enterNode?: Callback['onEnterNode'];
  leaveNode?: Callback['onLeaveNode'];
}

export const nodeNode = NG<NodeProp>(function* (params) {
  let isEntered = false;

  const onMouseEnter = (event: MouseEvent) => {
    params.enterNode?.(params.key)?.(event);

    isEntered = true;
    setTimeout(() => {
      isEntered && params.toggleTooltip(isEntered, params.key);
    }, 700);
  };

  const onMouseLeave = (event: MouseEvent) => {
    params.leaveNode?.(params.key)?.(event);

    isEntered = false;
    params.toggleTooltip(isEntered, params.key);
  };

  while (true) {    
    params = yield renderNode(
      <g
        class="graph-node"
        id={params.key}
        transform={'translate(' + (params.cx - params.width / 2) + ',' + (params.cy - params.height / 2) + ')'}
        onmouseenter={onMouseEnter}
        onmouseleave={onMouseLeave}
        onclick={params.clickByNode?.(params.key)}
      >
        <g class="graph-node__entity">
          <rect x="0" y="0" width={params.width} height={params.height} opacity="0"></rect>
          <use x="0" y="0" width={params.width} height={params.height} href={`#${params.styleId ?? GRAPH_NODE_DEFAULT_ID}`} />
        </g>
        <text class="graph-node__label" x={params.width + 10} y="20" filter="url(#solid)">
          {params.label}
        </text>
      </g>,
      this
    );
  }
});
