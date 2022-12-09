import { EG, p } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { render } from 'lit-html';
import { GraphDataNodeInfoItem } from '../../@types/graph.type';

export const tooltipElement = EG({
  props: {
    isVisible: p.req<boolean>(),
    pos: p.req<{
      top: number;
      left: number;
      pointerOffset: number;
    }>(),
    info: p.req<GraphDataNodeInfoItem[]>(),
  },
})(function* (params) {
  let isVisible = params.isVisible;
  let isMouseOver = false;

  const hide = (_isVisible: boolean) => {
    if (!isMouseOver && !_isVisible) {
      isVisible = _isVisible;
    }

    this.next();
  };

  const onMouseEnter = () => {
    isMouseOver = true;
  };

  const onMouseLeave = () => {
    isMouseOver = false;
    isVisible = false;

    this.next();
  };

  const preventMoving = (event: MouseEvent) => {
    event.stopPropagation();
  };

  while (true) {
    if (!params.isVisible) {
      setTimeout(() => {
        hide(params.isVisible);
      }, 300);
    } else {
      isVisible = params.isVisible;
    }

    params = yield render(
      <div
        class="view-graph-tooltip"
        onwheel={preventMoving}
        onmousedown={preventMoving}
        onmousemove={preventMoving}
        onmouseup={preventMoving}
        onmouseenter={onMouseEnter}
        onmouseleave={onMouseLeave}
        style={css`
          /* clean-css ignore:start */
          cursor: text;

          font-size: 15px;
          position: absolute;
          padding: 5px;
          z-index: 100000;

          top: ${params.pos?.top}px;
          left: ${params.pos?.left}px;
          visibility: ${isVisible ? 'visible' : 'hidden'};
          display: block;
          opacity: 1;
          /* clean-css ignore:end */
        `}
      >
        <div
          style={css`
            /* clean-css ignore:start */
            position: absolute;
            width: 0;
            height: 0;
            line-height: 0;
            border: 5px dashed #000;
            opacity: 0.5;
            left: ${params.pos?.pointerOffset}px;
            top: -5px;
            border-bottom-style: solid;
            border-top-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;
            /* clean-css ignore:end */
          `}
        ></div>
        <div
          style={css`
            border-radius: 3px;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;

            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            padding: 5px 8px 4px 8px;
            text-align: center;
          `}
        >
          <table
            style={css`
              width: 100%;
              text-align: left;
              white-space: nowrap;
            `}
          >
            {params.info?.map((it) => (
              <tr>
                <td
                  style={css`
                    font-weight: bold;
                    padding-right: 5px;
                  `}
                >
                  {it.key}
                </td>
                <td>{it.value}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>,
      this
    );
  }
});
