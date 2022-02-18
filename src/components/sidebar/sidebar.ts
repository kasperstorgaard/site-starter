import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property } from 'lit/decorators.js';
import { Overlayable } from '../overlay/overlayable-mixin';
import '../overlay/overlay';

@customElement('sg-sidebar')
export class SidebarElement extends Overlayable(LitElement) {
  static styles = [getStyles()];

  @property({ type: String, reflect: true })
  dir: 'left'|'right' = 'left';

  @property({ type: Boolean, reflect: true, attribute: 'should-animate' })
  shouldAnimate = false;

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
    position: fixed;

    /* on mobile: 100%, on desktop: 40% */
    width: max(40%, min(460px, 100vw));
    top: 0;
    height: 100%;
    z-index: var(--level-modal);

    padding: var(--sidebar-pad, var(--size-4) var(--app-gutter));

    background: var(--sidebar-bg, white);
  }

  /* hide when not open OR animating */
  :host(:not([is-open], [should-animate])) {
    display: none;
  }

  :host([dir=left]) {
    left: auto;
    right: 0;
  }

  :host([dir=left][is-open][should-animate]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-left);
  }

  :host([dir=left]:not([is-open])[should-animate]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-right);
  }

  :host([dir=right]) {
    left: 0;
    right: auto;
  }

  :host([dir=right][is-open][should-animate]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-right);
  }

  :host([dir=right]:not([is-open])[should-animate]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-left);
  }
  `;
}
