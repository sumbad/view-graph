/**
 * Need to use a wrapper component for React.js because when React tries to pass data to a custom element it always does so using HTML attributes.
 * Because attributes must be serialized to strings, this approach creates problems when the data being passed is an object or array.
 * This issue can be solved in React 19
 * 
 * @see https://github.com/facebook/react/issues/11347
 */
import React, { useRef, useEffect } from 'react';
import { elementToReact } from '@web-companions/react-adapter';
import { viewGraphElement } from '..';
import { EdgeStyle, GraphData, NodeStyle } from '../typings/graph.type';

const ViewGraphElementReact = viewGraphElement('view-graph').adapter(elementToReact);

type Props = {
  data: GraphData;
  edgeStyle: EdgeStyle;
  nodeStyle: NodeStyle;
};

export function ViewGraphReact(params: Props) {
  const viewGraphRef = useRef<{ props: any }>();

  useEffect(() => {
    if (viewGraphRef.current) {
      viewGraphRef.current.props = params;
    }
  });

  return (
    <div>
      <ViewGraphElementReact ref={viewGraphRef}></ViewGraphElementReact>
    </div>
  );
}
