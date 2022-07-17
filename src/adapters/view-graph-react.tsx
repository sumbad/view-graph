/**
 * Need to use a wrapper component for React.js because when React tries to pass data to a custom element it always does so using HTML attributes.
 * Because attributes must be serialized to strings, this approach creates problems when the data being passed is an object or array.
 * This issue can be solved in React 19
 *
 * @see https://github.com/facebook/react/issues/11347
 */
import React, { useRef, useEffect } from 'react';
import { elementToReact } from '@web-companions/react-adapter';
import { viewGraphElement } from '../viewGraph.element';
import { EdgeStyle, GraphData, NodeStyle } from '../@types/graph.type';
import { reactCSSPropertyToInlineStyle } from '../utils/style.util';

const ViewGraphElementReact = viewGraphElement('view-graph').adapter(elementToReact);

type Props = {
  data: GraphData;
  edgeStyle?: EdgeStyle;
  nodeStyle?: NodeStyle;
  style?: React.CSSProperties;
};

export function ViewGraphReact(params: Props) {
  const viewGraphRef = useRef<{ props: Props } & HTMLElement>();

  useEffect(() => {
    const viewGraphEl = viewGraphRef.current;
    if (viewGraphEl) {
      viewGraphEl.props = params;

      if (params.style != null) {
        viewGraphEl.setAttribute('style', reactCSSPropertyToInlineStyle(params.style));
      }
    }
  }, [params]);

  return (
    <div>
      <ViewGraphElementReact
        data={{
          nodes: [],
          edges: [],
        }}
        ref={viewGraphRef}
      ></ViewGraphElementReact>
    </div>
  );
}
