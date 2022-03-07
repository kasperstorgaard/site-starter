import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property, query } from 'lit/decorators.js';
import { Overlayable, overlayableStyles } from '../overlay/overlayable-mixin';
import { ScrollController } from '../scroll/scroll-controller';
import '../overlay/overlay';

@customElement('sg-lightbox')
export class LightboxElement extends Overlayable(LitElement) {
  static styles = [
    overlayableStyles,
    getStyles()
  ];

  private _scroll: ScrollController<LightboxElement>

  constructor() {
    super();
    // TODO: figure out why typescript does not like it
    // if the controller is created directly when declaring the property
    this._scroll = new ScrollController(this);
  }

  @query('.container')
  scrollContainer: HTMLElement | null;

  @property({ type: String })
  closeLabel: string = 'close';

  @property({ type: String })
  backLabel: string = 'back';

  @property({ type: String })
  forwardLabel: string = 'forward';

  render() {
    return html`
    <div class="container">
      <slot
        @click="${(event: Event) => event.stopPropagation()}"
      ></slot>
    </div>
    <button
      class="close"
      @click=${this.close}
      aria-label=${this.closeLabel}
    >&#x2715</button>
    <button
      class="arrow-back"
      aria-label=${this.backLabel}
      ?hidden=${this._scroll.isAtStart}
      @click=${this._backHandler}
    >
      <slot name="arrow-back">
        &#x2039
      </slot>
    </button>
    <button
      class="arrow-forward"
      aria-label=${this.forwardLabel}
      ?hidden=${this._scroll.isAtEnd}
      @click=${this._forwardHandler}
    >
      <slot name="arrow-forward">
        &#x203A
      </slot>
    </button>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', () => this.close());
  }

  private _backHandler(event: Event) {
    event.stopPropagation();
    this._scroll.goBack();
  }

  private _forwardHandler(event: Event) {
    event.stopPropagation();
    this._scroll.goForward();
  }
}

function getStyles() {
  return css`
  [hidden] {
    display: none !important;
  }

  :host {
    --lightbox-width: min(42rem, 100vw);
    --lightbox-height: min(33rem, 100vh);
    --lightbox-arrow-size: var(--size-7);
    --lightbox-arrow-distance: var(--app-gutter);

    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: minmax(0, auto) var(--lightbox-width) minmax(0, auto);
    grid-template-rows: minmax(0, auto) var(--lightbox-height) minmax(0, auto);
    grid-template-areas:
      ".     .     ."
      ". container ."
      ".     .     .";
    align-items: center;

    z-index: var(--level-modal);
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;

    padding: var(--lightbox-close-pad, var(--size-3) var(--app-gutter));

    font-size: var(--font-size-2);
    line-height: 1.5em;

    background: none;
    outline: none;
    border: none;

    transition: transform .33s var(--ease-3);
  }

  .arrow-back,
  .arrow-forward {
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    top: var(--lightbox-arrow-top, 50%);

    background: var(--lightbox-arrow-background, var(--gray-1));
    width: var(--lightbox-arrow-width, var(--lightbox-arrow-size));
    height: var(--lightbox-arrow-height, var(--lightbox-arrow-size));

    transform: var(--lightbox-arrow-transform, translateY(-50%));

    font-size: var(--lightbox-arrow-font-size, var(--font-size-fluid-1));

    box-shadow: var(--shadow-3);

    outline: none;
    border: none;
  }

  .arrow-back {
    left: var(--lightbox-arrow-left, var(--lightbox-arrow-distance));
  }

  .arrow-forward {
    right: var(--lightbox-arrow-right, var(--lightbox-arrow-distance));
  }

  .container {
    grid-area: container;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%;
    grid-template-rows: 100%;
    align-items: var(--lightbox-align, center);
    align-content: center;
    justify-items: center;

    overflow-x: auto;
    scroll-snap-type: x mandatory;

    /* Hide scrollbar for Chrome, Safari and Opera */
    -ms-overflow-style: none;
    scrollbar-width: none; /* Firefox */

    background: var(--sidebar-bg, transparent);
  }

  .container::-webkit-scrollbar {
    display: none;
  }

  .container slot::slotted(*) {
    scroll-snap-align: center;
    max-height: 100%;
    max-height: 100vh;
    overflow-y: scroll;
  }
  `;
}
