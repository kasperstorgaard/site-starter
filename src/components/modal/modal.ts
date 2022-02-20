import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property } from 'lit/decorators.js';
import { Overlayable } from '../overlay/overlayable-mixin';
import '../overlay/overlay';

@customElement('sg-modal')
export class ModalElement extends Overlayable(LitElement) {
  static styles = [getStyles()];

  @property({ type: Boolean, reflect: true, attribute: 'should-animate' })
  shouldAnimate = false;

  @property({ type: String, reflect: true })
  direction: 'up'|'down' = 'up';

  render() {
    return html`
    <slot></slot>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('animationend', () => this.shouldAnimate = false);
    this.addEventListener('animationcancel', () => this.shouldAnimate = false);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'complementary');
    }
  }

  updated(props: PropertyValues) {
    super.updated(props)

    if (props.has('isOpen') && props.get('isOpen') != null) {
      this.shouldAnimate = true;
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

    position: fixed;

    width: var(--modal-width);
    height: var(--modal-height);
    z-index: var(--level-modal);

    left: calc(50% - (var(--modal-width) / 2));
    top: calc(50% - (var(--modal-height) / 2));

    padding: var(--modal-pad, var(--size-4) var(--app-gutter));
    background: var(--modal-bg, var(--gray-0));
    border-radius: var(--modal-border-radius, var(--radius-1  ));
    box-shadow: var(--shadow-2);
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
