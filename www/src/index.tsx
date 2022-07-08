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
  let nodeStyle: NodeStyle | undefined = undefined;

  const object = document.querySelector('#svg') as HTMLObjectElement;

  const findSVGElements = () => {
    const svg = object.contentDocument!.firstChild! as SVGElement;

    nodeStyle = {
      width: 150,
      height: 160,
      svg: svg.innerHTML,
    };

    this.next();
  }

  // wait until all the resources are loaded
  window.addEventListener("load", findSVGElements, false);

  try {
    while (true) {
      yield render(
        <>
          <ViewGraphElement
            ref={ref(viewGraphElementRef)}
            data={graphData}
            edgeStyle={'polyline'}
            nodeStyle={nodeStyle}
          ></ViewGraphElement>
        </>,
        this
      );
    }
  } finally {
    window.removeEventListener('load', findSVGElements);
  }
})('demo-app');
