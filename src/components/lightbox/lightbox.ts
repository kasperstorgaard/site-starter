import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { Overlayable, overlayableStyles } from '../overlay/overlayable-mixin';
import { ScrollController } from '../scroll/scroll-controller';
import '../overlay/overlay';

@customElement('sg-lightbox')
export class LightboxElement extends Overlayable(LitElement) {
  static styles = [
    overlayableStyles,
    getStyles()
  ];

  private _scroll: ScrollController<LightboxElement>;

  constructor() {
    super();
    // TODO: figure out why typescript does not like it
    // if the controller is created directly when declaring the property
    this._scroll = new ScrollController(this);

    this.setAttribute('aria-roledescription', 'carousel');
  }

  @query('.container')
  scrollContainer: HTMLElement | null;

  @queryAssignedElements()
  items: HTMLElement[]

  @property({ type: String })
  closeLabel: string = 'close';

  @property({ type: String, reflect: true, attribute: 'aria-label' })
  ariaLabel: string;

  set index(value: number) {
    this._scroll.goTo(value, { behavior: 'instant' });
    this.requestUpdate();
  }

  @property({ type: Number, noAccessor: true })
  get index() {
    return this._scroll.index;
  }

  get focusableBounds() {
    return this.scrollContainer?.getBoundingClientRect() ?? null;
  }

  @property({ type: String })
  backLabel: string = 'back';

  @property({ type: String })
  forwardLabel: string = 'forward';

  updated(changes: Map<string, unknown>) {
    super.updated(changes);

    if (changes.has('index')) {
      this._scroll.goTo(this.index, { behavior: 'smooth' });
    }
  }

  render() {
    return html`
    <div class="container" aria-live="polite">
      <slot
        @slotchange=${this._setAriaItemAttributes}
        @click="${(event: Event) => event.stopPropagation()}"
      ></slot>
    </div>
    <button
      class="arrow-back"
      ?hidden=${this._scroll.isAtStart}
      @click=${this._backHandler}
    >
      <slot name="arrow-back">
        &#x2039&nbsp;<span class="visually-hidden">${this.backLabel}</span>
      </slot>
    </button>
    <button
      class="arrow-forward"
      ?hidden=${this._scroll.isAtEnd}
      @click=${this._forwardHandler}
    >
      <slot name="arrow-forward">
        &#x203A&nbsp;<span class="visually-hidden">${this.forwardLabel}</span>
      </slot>
    </button>
    <button
      class="close"
      @click=${this.close}
    ><span class="visually-hidden">${this.closeLabel}</span></button>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', () => this.close());

    if (!this.ariaLabel) {
      console.warn([
        'Please provide an aria label for lightbox element.',
        'https://www.w3.org/TR/wai-aria-practices/#carousel'
      ].join('\n'));
    }
  }

  private _backHandler(event: Event) {
    event.stopPropagation();
    this._scroll.goBack();
  }

  private _forwardHandler(event: Event) {
    event.stopPropagation();
    this._scroll.goForward();
  }

  private _setAriaItemAttributes() {
    for (const item of this.items) {
      if (!item.hasAttribute('aria-roledescription')) {
        item.setAttribute('aria-roledescription', 'slide');
      }

      if (!item.hasAttribute('role')) {
        item.setAttribute('role', 'group');
      }

      if (!item.hasAttribute('aria-label')) {
        console.warn([
          'Please set "aria-label" attribute on lightbox slide element.',
          'ex: aria-label="1 of 6"',
          'https://www.w3.org/TR/wai-aria-practices/#carousel',
        ].join('\n'));
      }
    }
  }
}

function getStyles() {
  return css`
  [hidden] {
    display: none !important;
  }

  /* util, extract? */
  .visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
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

    outline: none;

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
    border: none;

    transition: transform .33s var(--ease-3);
  }

  .close:before {
    content: "✕";
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
