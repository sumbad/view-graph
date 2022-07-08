import { NG } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { GraphNode, ToggleTooltip } from '../@types/graph.type';
import { renderNode } from '../utils/renderNode.directive';

export const nodeNode = NG<GraphNode & { toggleTooltip: ToggleTooltip }>(function* (params) {
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
      >
        <rect x="0" y="0" width={params.width} height={params.height} opacity="0"></rect>
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
    );
  }
});
