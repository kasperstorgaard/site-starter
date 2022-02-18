import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { ScrollLockController } from '../scroll-lock/scroll-lock-mixin';
import { OverlayElement } from './overlay';

type Constructor<T> = new (...args: any[]) => T;

declare class OverlayableInterface {
  isOpen: boolean;
  isScrollDisabled: boolean;
}

export const Overlayable =
  <T extends Constructor<LitElement>>(superClass: T) => {
    class OverlayableElement extends superClass {
      private _overlayElement: OverlayElement;

      scrollLock = new ScrollLockController(this);

      @property({ type: Boolean, reflect: true, attribute: 'is-open' })
      isOpen = false;

      get isScrollDisabled() {
        return this.isOpen;
      }

      connectedCallback(): void {
        super.connectedCallback();

        this._overlayElement = document.createElement('sg-overlay') as OverlayElement;
        document.body.appendChild(this._overlayElement);

        this._overlayElement.addEventListener('click', () => {
          if (!this.isOpen) {
            return;
          }

          this.isOpen = false;
        });
      }

      updated(changes: PropertyValues) {
        if (super.updated) {
          super.updated(changes);
        }

        if (changes.has('isOpen')) {
          this._overlayElement.isOpen = this.isOpen;
        }
      }

      disconnectedCallback(): void {
        super.disconnectedCallback();
        this._overlayElement?.remove();
      }
    }
    return OverlayableElement as Constructor<OverlayableInterface> & T;
  };
