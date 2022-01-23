import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('sg-overlay')
export class OverlayElement extends LitElement {
  static styles = [styles()];

  @property({ type: Boolean, reflect: true, attribute: 'has-content' })
  _hasContent = false;

  @property({ type: Boolean, reflect: true, attribute: 'is-animating' })
  _isAnimating = false;

  @query('slot')
  _slot: HTMLSlotElement;

  constructor() {
    super();

    this.addEventListener('animationstart', () => this._isAnimating = true);
    this.addEventListener('animationend', () => this._isAnimating = false);
    this.addEventListener('animationcancel', () => this._isAnimating = false);
  }

  protected firstUpdated() {
    const updateHasContent = () => {
      const nodes = this._slot?.assignedNodes();
      if ((!!nodes.length) !== this._hasContent) {
        this._hasContent = !!nodes.length;
      }
    };

    this._slot?.addEventListener('slotchange', updateHasContent);
    updateHasContent();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

function styles() {
  return css`
  :host {
    position: fixed;
    left: 0;
    top: 0;
    width: 0;
    height: 0;

    background: black;
  }

  :host([has-content]) {
    width: 100%;
    height: 100%;
    animation: fade-in 1s ease-out;
  }

  :host(:not([has-content])) {
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
