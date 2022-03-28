import { css, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { FocusTrapController } from '../../shared/controllers/focus-trap/focus-trap-controller';
import { ScrollLockController } from '../../shared/controllers/scroll-lock/scroll-lock-controller';
import { OverlayElement } from './overlay';

type Constructor<T> = new (...args: any[]) => T;

export const Overlayable = <T extends Constructor<LitElement>>(superClass: T) => {
    class OverlayableElement extends superClass {
      private _overlayElement: OverlayElement;
      private _isOpen = false;

      scrollLock = new ScrollLockController(this);
      focusTrap = new FocusTrapController(this);

      get isOpen() {
        return this._isOpen;
      }

      @property({ type: Boolean, reflect: true, attribute: 'is-open', noAccessor: true })
      set isOpen(value: boolean) {
        const oldVal = this._isOpen;
        if (value !== oldVal) {
          this._isOpen = value;
          this.setAttribute('animates', 'animates');
          this.requestUpdate('isOpen', oldVal);
        }
      }

      @property({ type: String, reflect: true })
      direction: 'up' | 'down' | 'left' | 'right' = 'up';

      get isScrollDisabled() {
        return this.isOpen;
      }

      get isFocusTrapped() {
        return this.isOpen;
      }

      connectedCallback(): void {
        super.connectedCallback();

        this._overlayElement = document.createElement('sg-overlay') as OverlayElement;
        document.body.appendChild(this._overlayElement);

        this.addEventListener('animationend', () => this.removeAttribute('animates'));
        this.addEventListener('animationcancel', () => this.removeAttribute('animates'));

        window.addEventListener('keyup', this._closeOnEscape);

        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'complementary');
        }

        this._overlayElement.addEventListener('click', () => {
          if (!this.isOpen) {
            return;
          }

          this.isOpen = false;
        });
      }

      updated(changes: PropertyValues) {
        super.updated(changes);

        if (changes.has('isOpen')) {
          this._overlayElement.isOpen = this.isOpen;
        }
      }

      disconnectedCallback(): void {
        super.disconnectedCallback();
        this._overlayElement?.remove();
        window.removeEventListener('keyup', this._closeOnEscape);
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

      private _closeOnEscape = (event: KeyboardEvent) => {
        if (this.isOpen && event.key === 'Escape') {
          this.close();
        }
      }
    }

    return OverlayableElement;
  };

/**
 * Styles for open/close animation
 */
export const overlayableStyles = css`
  /* hide when not open OR animating */
  :host(:not([is-open], [animates])) {
    display: none;
  }

  :host([direction=up][animates]) {
    transform-origin: left center;
  }

  :host([direction=up][is-open][animates]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-up);
  }

  :host([direction=up]:not([is-open])[animates]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-down);
  }

  :host([direction=up][animates]) {
    transform-origin: top center;
  }

  :host([direction=down][is-open][animates]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-down);
  }

  :host([direction=down]:not([is-open])[animates]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-up);
  }

  :host([direction=left][is-open][animates]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-left);
  }

  :host([direction=left]:not([is-open])[animates]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-right);
  }

  :host([direction=right][is-open][animates]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-right);
  }

  :host([direction=right]:not([is-open])[animates]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-left);
  }
`;
