import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sg-overlay')
export class OverlayElement extends LitElement {
  static styles = [styles()];

  @property({ type: Boolean, reflect: true, attribute: 'is-open' })
  isOpen = false;

  @property({ type: Boolean, reflect: true, attribute: 'animates' })
  animates = false;

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('animationend', () => this.animates = false);
    this.addEventListener('animationcancel', () => this.animates = false);
  }

  protected updated(props: Map<string | number | symbol, unknown>): void {
    super.updated(props);

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
    if (this.isOpen) {
      this.close()
    } else {
      this.open();
    }
  }
}

function styles() {
  return css`
  :host {
    --overlay-opacity: .5;
    --overlay-color: var(--gray-7);

    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: var(--level-backdrop);

    background: var(--overlay-color);
    opacity: var(--overlay-opacity);
  }

  :host(:not([is-open], [animates])) {
    display: none;
  }

  :host([is-open][animates]) {
    animation: overlay-fade-in .5s var(--ease-3);
  }

  :host(:not([is-open])[animates]) {
    animation: var(--animation-fade-out);
  }

  `;
}
