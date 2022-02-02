import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sg-overlay')
export class OverlayElement extends LitElement {
  static styles = [styles()];

  @property({ type: Boolean, reflect: true, attribute: 'is-open' })
  isOpen = true;

  @property({ type: Boolean, reflect: true, attribute: 'should-animate' })
  shouldAnimate = false;

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('animationend', () => this.shouldAnimate = false);
    this.addEventListener('animationcancel', () => this.shouldAnimate = false);
  }

  protected updated(props: Map<string | number | symbol, unknown>): void {
    super.updated(props);

    if (props.has('isOpen') && props.get('isOpen') != null) {
      this.shouldAnimate = true;
    }
  }
}

function styles() {
  return css`
  :host {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: var(--level-backdrop);

    background: black;
  }

  :host(:not([is-open], [should-animate])) {
    display: none;
  }

  :host([is-open][should-animate]) {
    animation: var(--animation-fade-in);
  }

  :host(:not([is-open])[should-animate]) {
    animation: var(--animation-fade-out);
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
