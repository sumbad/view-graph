import { NG } from '@web-companions/gfc';
import { ref, createRef, Ref } from 'lit-html/directives/ref.js';
import { Callback, EdgeStyle, GraphEdge } from '../@types/graph.type';
import { svgPath, bezierCommand } from '../utils/path.util';
import { renderNode } from '../utils/renderNode.directive';

export interface IEdgeProps extends GraphEdge {
  markerScale: number;
  edgeStyle: EdgeStyle;
  stroke?: string;
  strokeWidth?: number;
  clickByEdge?: Callback['onClickByEdge'];
  enterEdge?: Callback['onEnterEdge'];
  leaveEdge?: Callback['onLeaveEdge'];
}

export const edgeNode = NG<IEdgeProps>(function* (params) {
  const markerCircleRef: Ref<SVGMarkerElement> = createRef();
  const markerArrowRef: Ref<SVGMarkerElement> = createRef();
  const polylineRef: Ref<SVGPolylineElement> = createRef();

  const textNamePos = {
    x: 0,
    y: 0,
  };

  params = {
    stroke: '#000000',
    strokeWidth: 2,
    ...params,
  };

  const getPath = () => {
    let pointsPath = params.points;

    let strPath: string = '';

    pointsPath.forEach((point) => {
      let pathPoint: string = '';
      if(!Number.isNaN(point.x) && !Number.isNaN(point.y)) {
        pathPoint = `${String(point.x ?? 0)},${String(point.y ?? 0)}`;
      }

      strPath = `${strPath}${pathPoint} `;
    });

    return strPath;
  };

  requestAnimationFrame(() => {
    let markerCircle = markerCircleRef.value!;
    let markerArrow = markerArrowRef.value!;
    let polyline = polylineRef.value!;

    markerCircle.setAttribute('markerWidth', (6 * params.markerScale).toString());
    markerCircle.setAttribute('markerHeight', (6 * params.markerScale).toString());
    markerCircle.setAttribute('markerUnits', 'userSpaceOnUse');
    markerCircle.setAttribute('refX', (3 * params.markerScale).toString());
    markerCircle.setAttribute('refY', (3 * params.markerScale).toString());

    markerArrow.setAttribute('markerWidth', (8 * params.markerScale).toString());
    markerArrow.setAttribute('markerHeight', (8 * params.markerScale).toString());
    markerArrow.setAttribute('markerUnits', 'userSpaceOnUse');
    markerArrow.setAttribute('refX', (6 * params.markerScale).toString());
    markerArrow.setAttribute('refY', (5 * params.markerScale).toString());
    markerArrow.setAttribute('orient', 'auto');

    polyline.setAttribute('stroke-linejoin', 'bevel');

    const polylineBBox = polyline.getBBox();

    textNamePos.x = polylineBBox.x + polylineBBox.width / 2 - 100;
    textNamePos.y = polylineBBox.y + polylineBBox.height / 2 - 5;
  });

  while (true) {
    params = yield renderNode(
      <g
        id={params.key}
        class="graph-edge"
        onclick={params.clickByEdge?.(params.key)}
        onmouseenter={params.enterEdge?.(params.key)}
        onmouseleave={params.leaveEdge?.(params.key)}
      >
        <g class="graph-edge__entity" fill={params.stroke} stroke={params.stroke}>
          <defs>
            <marker id={'markerCircle' + params.key} ref={ref(markerCircleRef)}>
              <circle cx="3" cy="3" r="2" stroke="none" transform={'scale(' + params.markerScale + ')'} />
            </marker>
            <marker id={'markerArrow' + params.key} ref={ref(markerArrowRef)}>
              <path d="M2,2 L2,8 L7,5 L2,2" stroke="none" transform={'scale(' + params.markerScale + ')'} />
            </marker>
            {params.edgeStyle === 'polyline' ? (
              <polyline
                id={`line_${params.key}`}
                ref={ref(polylineRef)}
                marker-start={'url(#markerCircle' + params.key + ')'}
                marker-end={'url(#markerArrow' + params.key + ')'}
                points={getPath()}
                fill="none"
              />
            ) : (
              <path
                id={`line_${params.key}`}
                ref={ref(polylineRef)}
                marker-start={'url(#markerCircle' + params.key + ')'}
                // marker-end={'url(#markerArrow' + params.key + ')'}
                d={svgPath(
                  params.points.map((p) => [Number.isNaN(+p.x) ? 0 : p.x, Number.isNaN(+p.y) ? 0 : p.y]),
                  bezierCommand
                )}
                fill="none"
              />
            )}
          </defs>
          <use x="0" y="0" href={`#line_${params.key}`} stroke-width={params.strokeWidth! + 10} stroke-opacity="0" />
          <use x="0" y="0" href={`#line_${params.key}`} stroke-width={params.strokeWidth} />
        </g>
        {params.label != null ? (
          <text
            class="graph-edge__label"
            x={params.label.x}
            y={params.label.y}
            filter="url(#solid)"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {params.label.text}
          </text>
        ) : (
          ''
        )}
      </g>,
      this
    );
  }
});
