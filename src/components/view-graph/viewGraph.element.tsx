import { EG, p } from '@web-companions/gfc';
import { setStyle } from '@web-companions/h';
import { render } from 'lit-html';
import { ref, createRef } from 'lit-html/directives/ref.js';

import { graphNode } from '../../svg-components/graph.node';
import { EdgeStyle, GraphData, GraphDataNodeInfoItem, NodeStyle, Callback, ToggleTooltip, Translation } from '../../@types/graph.type';
import { computeGraph, getNodeStyleMap, handleZoom } from '../../utils/graph.util';
import { tooltipElement } from '../tooltip/tooltip.element';
import { controlsElement } from '../controls/controls.element';
import style from './style.scss';
import { ComponentFuncThis } from '@web-companions/gfc/@types';
import { LayoutConfig, ViewGraphElementProps } from '../../@types/ViewGraphElementProps';

const defaultNodeStyle: NodeStyle[] = [
  {
    width: 100,
    height: 100,
    svg: `
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="97" height="97" rx="8.5" stroke="black" stroke-width="3"/>
      </svg>`,
  },
];

const TooltipElement = tooltipElement('view-graph-tooltip');
const ControlsElement = controlsElement('view-graph-controls');
const Graph = graphNode();

export type ViewGraphElementType = ComponentFuncThis<ViewGraphElementProps> & { toggleTooltip: ToggleTooltip };

export const viewGraphElement = EG<ViewGraphElementProps>({
  props: {
    data: p.req(),
    edgeStyle: p.opt(),
    nodeStyle: p.opt(),
    callback: p.opt(),
    css: p.opt(),
    layoutConfig: p.opt(),
  },
})(function* (this: ViewGraphElementType, params) {
  const $ = this.attachShadow({ mode: 'open' });

  const graphNodeRef = createRef<HTMLDivElement>();

  ////////////////////

  const defaultTranslation = { x: 0, y: 0 },
    defaultZoom = 1,
    panSensitivity = 1,
    zoomSensitivity = 1,
    moveSensitivity = 10,
    minZoom = 0.1,
    maxZoom = 10;

  let translation = defaultTranslation;
  let zoom = defaultZoom;
  let transition: string | undefined;

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
      [translation, zoom] = handleZoom(
        e.deltaY,
        zoom,
        zoomSensitivity,
        minZoom,
        maxZoom,
        e.clientX,
        e.clientY,
        mapElement.getBoundingClientRect(),
        translation
      );
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

  const handleKeydown = (e: KeyboardEvent) => {
    if (!e.key.startsWith('Arrow')) {
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
        translation.x += moveSensitivity / zoom;
        break;
      case 'ArrowLeft':
        translation.x -= moveSensitivity / zoom;
        break;
      case 'ArrowDown':
        translation.y += moveSensitivity / zoom;
        break;
      case 'ArrowUp':
        translation.y -= moveSensitivity / zoom;
        break;
    }

    e.preventDefault();
    updateTransform();
  };

  const updateTransform = () => {
    transform = `translate(${translation.x}px, ${translation.y}px) scale(${zoom})`;

    isTooltipVisible = false;

    this.next();
  };

  const toggleTooltip: ToggleTooltip = (isVisible, nodeKey) => {
    isTooltipVisible = isVisible;

    if (isTooltipVisible) {
      const node = params.data.nodes.find((it) => it.id === nodeKey)!;

      if (node.info == null || node.info.length === 0) {
        isTooltipVisible = false;
        this.next();

        return;
      }

      tooltipInfo = node.info ?? [];

      const viewGraphRect: DOMRect = mapElement.getBoundingClientRect();
      const nodeRect = ($.getElementById(nodeKey)!.firstElementChild as SVGRectElement).getBoundingClientRect();

      let left = nodeRect.x - viewGraphRect.x - nodeRect.width;
      let top = nodeRect.y - viewGraphRect.y + nodeRect.height;
      let pointerOffset = nodeRect.width + nodeRect.width / 2;

      if (left < 0) {
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
  this.toggleTooltip = toggleTooltip.bind(this);

  const onZoom = (scale: number) => () => {
    transition = 'transform .2s ease-in-out';

    const clientX = mapElement.getBoundingClientRect().width / 2;
    const clientY = mapElement.getBoundingClientRect().height / 2;

    [translation, zoom] = handleZoom(
      scale,
      zoom,
      zoomSensitivity,
      minZoom,
      maxZoom,
      clientX,
      clientY,
      mapElement.getBoundingClientRect(),
      translation
    );

    updateTransform();

    requestAnimationFrame(() => {
      transition = 'none';
    });
  };

  const onZoomCenter = () => {
    translation = defaultTranslation;
    zoom = defaultZoom;
    updateTransform();
  };

  const destroy = () => {
    if (mapElement == null) {
      return;
    }

    mapElement.removeEventListener('wheel', handleWheelEvent);
    mapElement.removeEventListener('mousedown', handleMousedownEvent);
    mapElement.removeEventListener('mousemove', handleMousemoveEvent);
    mapElement.removeEventListener('mouseup', handleMouseupEvent);
    mapElement.removeEventListener('keydown', handleKeydown);
  };

  requestAnimationFrame(() => {
    mapElement = graphNodeRef.value!;

    if (mapElement == null) {
      return;
    }

    destroy();

    mapElement.addEventListener('mousedown', handleMousedownEvent);
    mapElement.addEventListener('mousemove', handleMousemoveEvent);
    mapElement.addEventListener('mouseup', handleMouseupEvent);
    mapElement.addEventListener('wheel', handleWheelEvent);
    mapElement.addEventListener('keydown', handleKeydown);

    this.next();
  });

  try {
    let graphCss = params.css;
    let graphData: GraphData | undefined;
    let graph: ReturnType<typeof computeGraph>;
    let nodeStyle = params.nodeStyle;
    let nodeStyleMap: Map<string, NodeStyle>;
    let options: Partial<LayoutConfig> | undefined = params.layoutConfig;

    setStyle(`${style}\n${graphCss}`, $);

    while (true) {
      if (
        params.data !== graphData ||
        (params.nodeStyle != null && params.nodeStyle !== nodeStyle) ||
        !Object.is(params.layoutConfig, options)
      ) {
        graphData = params.data;
        nodeStyle = params.nodeStyle;
        options = params.layoutConfig;

        nodeStyleMap = getNodeStyleMap(nodeStyle ?? defaultNodeStyle);

        graph = computeGraph(graphData, nodeStyleMap, options);
      }

      if (!Object.is(params.css, graphCss)) {
        graphCss = params.css;
        setStyle(`${style}\n${graphCss}`, $);
      }

      params = yield render(
        <div class="view-graph" ref={ref(graphNodeRef)} tabindex="0">
          <TooltipElement isVisible={isTooltipVisible} pos={tooltipPos} info={tooltipInfo}></TooltipElement>
          {graph != null ? (
            <Graph
              nodes={graph.nodes}
              edges={graph.edges}
              nodeStyle={nodeStyleMap!}
              edgeStyle={params.edgeStyle ?? 'polyline'}
              transform={transform}
              transition={transition}
              toggleTooltip={toggleTooltip}
              callback={params.callback}
            ></Graph>
          ) : (
            'Computing...'
          )}

          <ControlsElement onzoomIn={onZoom(-50)} onzoomOut={onZoom(50)} onzoomCenter={onZoomCenter}></ControlsElement>
        </div>,
        $
      );
    }
  } finally {
    destroy();
  }
});
