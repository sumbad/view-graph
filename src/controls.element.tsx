import { EG, p } from '@web-companions/gfc';
import { css } from '@web-companions/h';
import { render } from 'lit-html';

export const controlsElement = EG({
  props: {
    onzoomIn: p.req<(event: CustomEvent) => void>(),
    onzoomOut: p.req<(event: CustomEvent) => void>(),
    onzoomCenter: p.req<(event: CustomEvent) => void>(),
  },
})(function* () {
  const emitEvent = (eventType: 'In' | 'Out' | 'Center') => () => {
    this.dispatchEvent(new CustomEvent(`zoom${eventType}`));
  };

  while (true) {
    yield render(
      <div
        class="view-graph-controls"
        style={css`
          bottom: 8px;
          left: 8px px;
          position: absolute;
        `}
      >
        <div class="ico">
          <button class="" title="Zoom In" onclick={emitEvent('In')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-zoom-in"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="10" cy="10" r="7"></circle>
              <line x1="7" y1="10" x2="13" y2="10"></line>
              <line x1="10" y1="7" x2="10" y2="13"></line>
              <line x1="21" y1="21" x2="15" y2="15"></line>
            </svg>
          </button>
        </div>

        <div class="ico">
          <button class="" title="Zoom Out" onclick={emitEvent('Out')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-zoom-out"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="10" cy="10" r="7"></circle>
              <line x1="7" y1="10" x2="13" y2="10"></line>
              <line x1="21" y1="21" x2="15" y2="15"></line>
            </svg>
          </button>
        </div>

        <div class="ico">
          <button class="" title="See whole graph" onclick={emitEvent('Center')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-focus-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="12" cy="12" r=".5" fill="currentColor"></circle>
              <circle cx="12" cy="12" r="7"></circle>
              <line x1="12" y1="3" x2="12" y2="5"></line>
              <line x1="3" y1="12" x2="5" y2="12"></line>
              <line x1="12" y1="19" x2="12" y2="21"></line>
              <line x1="19" y1="12" x2="21" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>,

      this
    );
  }
});
