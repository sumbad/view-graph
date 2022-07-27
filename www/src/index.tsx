import { EG } from '@web-companions/gfc';
import { viewGraphElement } from '../../src';
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

  const onClickByNode = (event: MouseEvent) => {
    const target = event.target as SVGElement;

    if (target instanceof SVGTextElement) {
      target.style.fill = 'red';
      target.style.fontWeight = 'bold';
    }

    const id = target.parentElement!.id;

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

  const onClickByEdge = (event: MouseEvent) => {
    const target = event.target as SVGElement;
    const parent = target.parentElement!;

    parent.childNodes.forEach((it) => {
      if (it instanceof SVGElement) {
        it.style.stroke = 'red';
      }
    });
  };

  const graphOverwriteCss = /*css*/`
    #Node_1 text:hover {
      stroke: purple;
    }

    [name="graph-edge__label"] {
      font-style: italic;
    }
  `;

  try {
    while (true) {
      yield render(
        <>
          <ViewGraphElement
            ref={ref(viewGraphElementRef)}
            data={data}
            edgeStyle={'polyline'}
            nodeStyle={nodeStyle}
            callback={{ onClickByNode, onClickByEdge }}
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
