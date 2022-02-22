import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { Overlayable } from '../overlay/overlayable-mixin';
import '../overlay/overlay';

@customElement('sg-modal')
export class ModalElement extends Overlayable(LitElement) {
  static styles = [getStyles()];

  @queryAssignedElements({ slot: 'header' })
  private _headerItems: Array<HTMLElement>;

  @queryAssignedElements({ slot: 'footer' })
  private _footerItems: Array<HTMLElement>;

  @property({ type: Boolean, reflect: true, attribute: 'should-animate' })
  animates = false;

  @property({ type: String, reflect: true })
  direction: 'up'|'down' = 'up';

  @property({ type: String })
  closeLabel = 'close';

  render() {
    return html`
    <header ?hidden=${!this._headerItems.length}>
      <slot name="header"></slot>
    </header>
    <button
      class="close"
      @click=${this.close}
      aria-label=${this.closeLabel}
    >&#x2715</button>
    <div>
      <slot></slot>
    </div>
    <footer ?hidden=${!this._footerItems.length}>
      <slot name="footer"></slot>
    </footer>
  `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('animationend', () => this.animates = false);
    this.addEventListener('animationcancel', () => this.animates = false);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'complementary');
    }
  }

  updated(props: PropertyValues) {
    super.updated(props)

    if (props.has('isOpen') && props.get('isOpen') != null) {
      this.animates = true;
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

function getStyles() {
  return css`
  :host {
    /* on mobile: 100%, on desktop: 40% */
    --modal-size: 28rem;
    --modal-ratio: calc(4/3);
    --modal-width: min(var(--modal-size), 100vw);
    --modal-height: min(calc(var(--modal-size) / var(--modal-ratio)), 100vh);
    --modal-pad: var(--size-4) var(--app-gutter);

    position: fixed;
    display: flex;
    flex-direction: column;

    width: var(--modal-width);
    height: var(--modal-height);
    z-index: var(--level-modal);

    left: calc(50% - (var(--modal-width) / 2));
    top: calc(50% - (var(--modal-height) / 2));

    background: var(--modal-bg, var(--gray-0));
    border-radius: var(--modal-border-radius, var(--radius-1  ));
    border: var(--border-size-2) solid var(--gray-9);
    box-shadow: var(--shadow-2);
  }

  :host > div {
    flex-grow: 1;

    padding: var(--modal-pad, var(--size-4) var(--app-gutter));
  }

  header {
    padding: var(--modal-header-pad, var(--size-3) var(--app-gutter));

    text-transform: uppercase;
    font-weight: var(--font-weight-5);

    border-bottom: var(--border-base);
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: var(--modal-header-pad, var(--size-3) var(--app-gutter));

    font-size: var(--font-size-2);
    line-height: 1.5em;

    background: none;
    outline: none;
    border: none;

    transition: transform .33s var(--ease-3);
  }

  .close:hover,
  .close:active {
    transform: scale(1.05);
  }

  footer {
    padding: var(--modal-header-pad, var(--size-3) var(--app-gutter));
    border-top: var(--border-base);
  }

  /* hide when not open OR animating */
  :host(:not([is-open], [should-animate])) {
    display: none;
  }

  :host([direction=up][should-animate]) {
    transform-origin: left center;
  }

  :host([direction=up][is-open][should-animate]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-up);
  }

  :host([direction=up]:not([is-open])[should-animate]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-down);
  }

  :host([direction=up][should-animate]) {
    transform-origin: top center;
  }

  :host([direction=down][is-open][should-animate]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-down);
  }

  :host([direction=down]:not([is-open])[should-animate]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-up);
  }
  `;
}
