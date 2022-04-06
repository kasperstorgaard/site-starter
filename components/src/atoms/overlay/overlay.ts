import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import animationKeyframes from '../../styles/props/animation-keyframes';

@customElement('sg-overlay')
export class OverlayElement extends LitElement {
  static styles = [
    animationKeyframes,
    styles()
  ];

  private _isOpen = false;

  get isOpen() {
    return this._isOpen;
  }

  @property({ type: Boolean, reflect: true, attribute: 'is-open', noAccessor: true })
  set isOpen(value: boolean) {
    const oldVal = this._isOpen;

    if (value !== oldVal) {
      this._isOpen = value;

      if (value) {
        this.removeAttribute('hidden');
      }

      this.requestUpdate('isOpen', oldVal);
    }
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.isOpen) {
      this.setAttribute('hidden', 'hidden');
    }

    this.addEventListener('animationend', () => this.toggleAttribute('hidden', !this.isOpen));
    this.addEventListener('animationcancel', () => this.toggleAttribute('hidden', !this.isOpen));
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

  :host([is-open]) {
    animation: var(--animation-fade-in);
  }

  :host(:not([is-open])) {
    animation: var(--animation-fade-out);
  }

  /* Local override of "fade-in" animation defined in shared */
  @keyframes fade-in {
    to { opacity: var(--overlay-opacity) }
  }
  `;
}
