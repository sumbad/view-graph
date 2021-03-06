import { EG, p } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { render } from 'lit-html';
import { ref, createRef } from 'lit-html/directives/ref.js';

import { graphNode } from './svg-components/graph.node';
import { EdgeStyle, GraphData, GraphDataNodeInfoItem, NodeStyle, ToggleTooltip, Translation } from './@types/graph.type';
import { computeGraph } from './utils/graph.util';
import { tooltipElement } from './tooltip.element';

const defaultNodeStyle: NodeStyle = {
  width: 100,
  height: 100,
  svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="97" height="97" rx="8.5" stroke="black" stroke-width="3"/>
        </svg>`,
};

const TooltipElement = tooltipElement('view-graph-tooltip');
const Graph = graphNode();

export const viewGraphElement = EG({
  props: {
    data: p.req<GraphData>(),
    edgeStyle: p.opt<EdgeStyle>(),
    nodeStyle: p.opt<NodeStyle>(),
  },
})(function* (params) {
  const $ = this.attachShadow({ mode: 'open' });

  const graphNodeRef = createRef<HTMLDivElement>();

  let nodeStyle = params.nodeStyle != null ? params.nodeStyle : defaultNodeStyle;

  let graphData = params.data;
  let graph = computeGraph(graphData, nodeStyle);

  ////////////////////

  const defaultTranslation = { x: 0, y: 0 },
    defaultZoom = 1,
    panSensitivity = 1,
    zoomSensitivity = 1,
    minZoom = 0.1,
    maxZoom = 10;

  let translation = defaultTranslation;
  let zoom = defaultZoom;

  let startGrabMousePosition: Translation | null;
  let startGrabTranslation: Translation | null;

  let mapElement: HTMLElement;

  let transform = `translate(${defaultTranslation.x}px, ${defaultTranslation.y}px) scale(${defaultZoom})`;

  let isTooltipVisible = false;
  let tooltipPos = {
    top: 0,
    left: 0,
    pointerOffset: 0,
  };
  let tooltipInfo: GraphDataNodeInfoItem[] = [];

  const handleWheelEvent = (e: WheelEvent) => {
    e.preventDefault();

    if (!e.ctrlKey) {
      const deltaX = e.deltaX > 0 ? Math.min(e.deltaX, 75) : Math.max(e.deltaX, -75);
      const deltaY = e.deltaY > 0 ? Math.min(e.deltaY, 75) : Math.max(e.deltaY, -75);

      translation = {
        x: translation.x - deltaX * panSensitivity,
        y: translation.y - deltaY * panSensitivity,
      };
    } else if (e.ctrlKey) {
      [translation, zoom] = handleZoom(e);
    }

    updateTransform();
  };

  const handleMousedownEvent = (e: MouseEvent) => {
    startGrabMousePosition = {
      x: e.clientX,
      y: e.clientY,
    };
    startGrabTranslation = translation;
  };

  const handleMousemoveEvent = (e: MouseEvent) => {
    if (startGrabTranslation && startGrabMousePosition) {
      translation = {
        x: startGrabTranslation.x + e.clientX - startGrabMousePosition.x,
        y: startGrabTranslation.y + e.clientY - startGrabMousePosition.y,
      };

      updateTransform();
    }
  };

  const handleMouseupEvent = () => {
    startGrabMousePosition = null;
  };

  const updateTransform = () => {
    transform = `translate(${translation.x}px, ${translation.y}px) scale(${zoom})`;

    isTooltipVisible = false;

    this.next();
  };

  const handleZoom = (e: WheelEvent): [Translation, number] => {
    const xScale = (e.clientX - mapElement.getBoundingClientRect().x - translation.x) / zoom;
    const yScale = (e.clientY - mapElement.getBoundingClientRect().y - translation.y) / zoom;

    const adjSensitivity = zoomSensitivity;
    let newZoom = zoom - zoom * e.deltaY * 0.01 * adjSensitivity;

    if (minZoom != null) {
      newZoom = Math.max(minZoom, newZoom);
    }
    if (maxZoom != null) {
      newZoom = Math.min(maxZoom, newZoom);
    }

    const newTranslation = {
      x: e.clientX - mapElement.getBoundingClientRect().x - xScale * newZoom,
      y: e.clientY - mapElement.getBoundingClientRect().y - yScale * newZoom,
    };

    return [newTranslation, newZoom];
  };

  const initPanZoom = () => {
    if (mapElement == null) {
      return;
    }

    destroy();

    mapElement.addEventListener('mousedown', handleMousedownEvent);
    mapElement.addEventListener('mousemove', handleMousemoveEvent);
    mapElement.addEventListener('mouseup', handleMouseupEvent);
    mapElement.addEventListener('wheel', handleWheelEvent);
  };

  const destroy = () => {
    if (mapElement == null) {
      return;
    }

    mapElement.removeEventListener('wheel', handleWheelEvent);
    mapElement.removeEventListener('mousedown', handleMousedownEvent);
    mapElement.removeEventListener('mousemove', handleMousemoveEvent);
    mapElement.removeEventListener('mouseup', handleMouseupEvent);
  };

  const toggleTooltip: ToggleTooltip = (isVisible, nodeKey) => {
    isTooltipVisible = isVisible;

    if (isTooltipVisible) {
      const node = params.data.nodes.find((it) => it.id === nodeKey)!;

      if (node.info == null || node.info.length === 0) {
        return;
      }

      tooltipInfo = node.info ?? [];

      const viewGraphRect:DOMRect = mapElement.getBoundingClientRect();
      const nodeRect = ($.getElementById(nodeKey)!.firstElementChild as SVGRectElement).getBoundingClientRect();

      let left = nodeRect.x - viewGraphRect.x - nodeRect.width;
      let top = nodeRect.y - viewGraphRect.y + nodeRect.height;
      let pointerOffset = nodeRect.width + nodeRect.width / 2;

      if(left < 0) {
        left = nodeRect.x;
        pointerOffset = 10;
      }

      tooltipPos = {
        left,
        top,
        pointerOffset,
      };
    }

    this.next();
  };

  requestAnimationFrame(() => {
    mapElement = graphNodeRef.value!;
    initPanZoom();

    this.next();
  });

  try {
    while (true) {
      if (params.data !== graphData || (params.nodeStyle != null && params.nodeStyle !== nodeStyle)) {
        graphData = params.data;
        nodeStyle = params.nodeStyle != null ? params.nodeStyle : defaultNodeStyle;

        graph = computeGraph(graphData, nodeStyle);
      }

      params = yield render(
        <div
          style={css`
            /* position: absolute; */
            /* display: block; */
            transition: opacity 0.75s ease, width 0.75s ease;
            overflow: hidden;
            font-family: sans-serif;
            height: calc(100% - 2rem);
            width: calc(100% - 2rem);
            padding: 1rem;
            cursor: grab;
          `}
          id="graph-container"
          ref={ref(graphNodeRef)}
        >
          <TooltipElement isVisible={isTooltipVisible} pos={tooltipPos} info={tooltipInfo}></TooltipElement>
          {graph != null ? (
            <Graph
              nodes={graph.nodes}
              edges={graph.edges}
              nodeStyle={nodeStyle}
              edgeStyle={params.edgeStyle ?? 'polyline'}
              transform={transform}
              toggleTooltip={toggleTooltip}
            ></Graph>
          ) : (
            'Computing...'
          )}
        </div>,
        $
      );
    }
  } finally {
    destroy();
  }
});
