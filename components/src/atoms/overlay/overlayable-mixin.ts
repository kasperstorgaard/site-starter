import { css, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { FocusTrapController } from '../../shared/controllers/focus-trap/focus-trap-controller';
import { ScrollLockController } from '../../shared/controllers/scroll-lock/scroll-lock-controller';
import animationKeyframes from '../../styles/props/animation-keyframes';
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
        if (value === this._isOpen) {
          return;
        }

        const oldVal = this._isOpen;
        this._isOpen = value;
        this.requestUpdate('isOpen', oldVal);

        if (value) {
          this.removeAttribute('hidden');
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

        if (!this.isOpen) {
          this.setAttribute('hidden', 'hidden');
        }

        this.addEventListener('animationend', () => this.toggleAttribute('hidden', !this.isOpen));
        this.addEventListener('animationcancel', () => this.toggleAttribute('hidden', !this.isOpen));

        window.addEventListener('keyup', this._closeOnEscape);

        if (!this.hasAttribute('tabindex')) {
          this.setAttribute('tabindex', '-1');
        }

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

          if (this.isOpen) {
            this.focus();
          }
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
export const overlayableStyles = [
  animationKeyframes,
  css`
  :host([direction=up]) {
    transform-origin: top center;
  }

  :host([direction=up][is-open]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-up);
  }

  :host([direction=up]:not([is-open])) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-down);
  }

  :host([direction=down]) {
    transform-origin: top center;
  }

  :host([direction=down][is-open]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-down);
  }

  :host([direction=down]:not([is-open])) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-up);
  }

  :host([direction=left]) {
    transform-origin: right center;
  }

  :host([direction=left][is-open]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-left);
  }

  :host([direction=left]:not([is-open])) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-right);
  }

  :host([direction=right]) {
    transform-origin: left center;
  }

  :host([direction=right][is-open]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-right);
  }

  :host([direction=right]:not([is-open])) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-left);
  }
`];
