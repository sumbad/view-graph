/**
 * Need to use a wrapper component for React.js because when React tries to pass data to a custom element it always does so using HTML attributes.
 * Because attributes must be serialized to strings, this approach creates problems when the data being passed is an object or array.
 * This issue can be solved in React 19
 *
 * @see https://github.com/facebook/react/issues/11347
 */
import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { elementToReact } from '@web-companions/react-adapter';
import { viewGraphElement, ViewGraphElementProps } from '../viewGraph.element';
import { reactCSSPropertyToInlineStyle } from '../utils/style.util';

const ViewGraphElementReact = viewGraphElement('view-graph').adapter(elementToReact);

interface Props extends ViewGraphElementProps {
  style?: React.CSSProperties;
};

export const ViewGraphReact = React.forwardRef((params: Props, ref) => {
  const viewGraphRef = useRef<{ props: Props } & HTMLElement>(null);
  useImperativeHandle(ref, () => viewGraphRef.current);

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
});