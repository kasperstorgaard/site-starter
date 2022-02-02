import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sg-overlay')
export class OverlayElement extends LitElement {
  static styles = [styles()];

  @property({ type: Boolean, reflect: true, attribute: 'is-open' })
  isOpen = true;

  @property({ type: Boolean, reflect: true, attribute: 'is-animating' })
  isAnimating = false;

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('animationstart', () => this.isAnimating = true);
    this.addEventListener('animationend', () => this.isAnimating = false);
    this.addEventListener('animationcancel', () => this.isAnimating = false);
  }

  protected updated(props: Map<string | number | symbol, unknown>): void {
    super.updated(props);

    if (props.has('isOpen') && props.get('isOpen') != null) {
      this.isAnimating = true;
    }
  }
}

function styles() {
  return css`
  :host {
    position: fixed;
    width: 0;
    height: 0;
    left: 0;
    top: 0;

    background: black;
  }

  :host([is-open]) {
    width: 100%;
    height: 100%;
  }

  :host([is-open][is-animating]) {
    animation: fade-in 1s ease-out;
  }

  :host(:not([is-open])[is-animating]) {
    animation: fade-out 1s ease-in;
  }

  @keyframes fade-in {
    from {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
    to {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  `;
}
