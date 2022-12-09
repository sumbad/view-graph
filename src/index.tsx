import { EG } from '@web-companions/gfc';
import { viewGraphElement, ViewGraphElementType } from '../../src';
import { render } from 'lit-html';
import { createRef, ref } from 'lit-html/directives/ref.js';
import { NodeStyle } from '../../src/@types/graph.type';

import graphData from '../graphData.json';

const ViewGraphElement = viewGraphElement('view-graph');

/**
 * ROOT element
 */
EG()(function* () {
  const viewGraphElementRef = createRef<HTMLElement>();
  let nodeStyle: NodeStyle | NodeStyle[] | undefined;
  let data = graphData;

  const svg = document.querySelector('#svg') as HTMLObjectElement;

  const findSVGElements = () => {
    const nodeStyle1svg = svg.contentDocument!.firstChild! as SVGElement;
    const nodeStyle2svg = nodeStyle1svg.cloneNode(true) as SVGElement;

    (nodeStyle2svg.firstElementChild! as SVGPathElement).setAttribute('fill', 'red');

    nodeStyle = [
      {
        width: 150,
        height: 160,
        svg: nodeStyle1svg.innerHTML,
      },
      {
        id: 'selectedNode',
        width: 150,
        height: 160,
        svg: nodeStyle2svg.innerHTML,
      },
    ];

    this.next();
  };

  // wait until all the resources are loaded
  window.addEventListener('load', findSVGElements, false);

  const onClickByNode = (nodeId: string) => (event: MouseEvent) => {
    console.log('nodeId', nodeId);

    const target = event.target as SVGElement;

    if (target instanceof SVGTextElement) {
      target.style.fill = 'red';
      target.style.fontWeight = 'bold';
    }

    const id = target.parentElement?.parentElement?.id;

    const nodes = graphData.nodes.map((n) => ({
      ...n,
      styleId: n.id === id ? 'selectedNode' : undefined,
    }));

    data = {
      ...data,
      nodes,
    };

    this.next();
  };

  const onClickByEdge = (edgeId: string) => (event: MouseEvent) => {
    console.log('edgeId', edgeId);
    const target = event.target as SVGElement;
    const parent = target.parentElement!;

    parent.childNodes.forEach((it) => {
      if (it instanceof SVGElement) {
        it.style.stroke = 'red';
        it.style.fill = 'red';
      }
    });
  };

  const onEnterEdge = (edgeId: string) => (event: MouseEvent) => {
    const fromNode = edgeId.at(0)!;
    const target = event.target as SVGElement;
    const viewGraphEl = target.getRootNode() as HTMLElement;

    viewGraphEl.querySelectorAll('.graph-edge').forEach((it) => {
      if (it instanceof SVGElement && it.id.startsWith(fromNode)) {
        it.classList.add('graph-edge_hover');
      }
    });
  };

  const onLeaveEdge = (_edgeId: string) => (event: MouseEvent) => {
    const target = event.target as SVGElement;
    const viewGraphEl = target.getRootNode() as HTMLElement;

    viewGraphEl.querySelectorAll('.graph-edge').forEach((it) => {
      if (it instanceof SVGElement) {
        it.classList.remove('graph-edge_hover');
      }
    });
  };

  let isShowingNodeId: string | null = null;

  const onEnterNode = (nodeId: string) => (event: MouseEvent) => {
    const viewGraphEl = viewGraphElementRef.value as ViewGraphElementType;
    isShowingNodeId = nodeId;

    // Set additional timeout to emulate async operation
    setTimeout(() => {
      const nodeById = graphData.nodes.find((n) => n.id === nodeId);

      if (nodeById != null && (nodeById.info == null || nodeById.info.length === 0)) {
        nodeById.info = [
          {
            key: nodeId,
            value: 'Info data was not found!',
          },
        ];

        this.next(); // this line depends on a framework or your library for creating components
        
        if (isShowingNodeId === nodeId) {
          viewGraphEl.toggleTooltip(true, nodeId);
        }
      }
    }, 1000);
  };

  const onLeaveNode = (nodeId: string) => (event: MouseEvent) => {
    isShowingNodeId = null;
    console.log('leave', nodeId);
  };

  let graphOverwriteCss = /*css*/ `
    .graph-node, .graph-edge {
      cursor: pointer;
    }

    .graph-edge__label {
      font-style: italic;
      transition: stroke .2s ease;
    }

    .graph-edge__entity {
      font-style: italic;
      transition: fill .2s ease;
    }

    .graph-edge_hover > .graph-edge__entity, .graph-edge_hover > .graph-edge__label  {
      fill: black;
      stroke: black;
    }
  `;

  setTimeout(() => {
    graphOverwriteCss = /*css*/ `
      ${graphOverwriteCss}

      #Node_1 text {
        stroke: green;
      }
    `;

    this.next();
  }, 2000);

  try {
    while (true) {
      yield render(
        <>
          <ViewGraphElement
            ref={ref(viewGraphElementRef)}
            data={data}
            edgeStyle={'polyline'}
            nodeStyle={nodeStyle}
            callback={{ onClickByNode, onClickByEdge, onEnterEdge, onLeaveEdge, onEnterNode, onLeaveNode }}
            css={graphOverwriteCss}
          ></ViewGraphElement>
        </>,
        this
      );
    }
  } finally {
    window.removeEventListener('load', findSVGElements);
  }
})('demo-app');
