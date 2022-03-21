import { property } from '@lit/reactive-element/decorators/property.js';
import { LitElement } from 'lit'

type Constructor<T> = new (...args: any[]) => T;

export const FormControllable = <T extends Constructor<LitElement>>(superClass: T) => {
    class FormControllableElement extends superClass {
      // Identify the element as a form-associated custom element
      static formAssociated = true;

      // TODO: replace with ElementInternals when types are up to date.
      private _internals?: any;
      private _fallbackControl: HTMLInputElement | null = null;

      @property({ type: String })
      name: string;

      protected get form() {
        return this._internals?.form ?? this._internals?.form;
      }

      protected get type() {
        return this.localName ?? this._fallbackControl?.type;
      }

      protected get validity() {
        return this._internals?.validity ??
          this._fallbackControl?.validity;
      }

      protected get validationMessage() {
        return this._internals?.validationMessage ??
          this._fallbackControl?.validationMessage;
      }

      protected get willValidate() {
        return this._internals?.willValidate ??
          this._fallbackControl?.willValidate;
      }

      constructor(...args: any[]) {
        super(...args);

        if (this.attachInternals) {
          this._internals = this.attachInternals();
        }
      }

      connectedCallback(): void {
        super.connectedCallback();

        if (!this.name) {
          throw new Error('Please provide a value for attribute "name"');
        }

        if (!('ElementInternals' in window) || !('setFormValue' in window.ElementInternals.prototype)) {
          this._setupFallbackControl();
        }
      }

      checkValidity() {
        return this._internals?.checkValidity() ??
          this._fallbackControl?.checkValidity();
      }

      reportValidity() {
        return this._internals.reportValidity() ??
          this._fallbackControl?.reportValidity();
      }

      private _setupFallbackControl() {
        const input = document.createElement('input');
        input.setAttribute('hidden', 'hidden');
        input.setAttribute('aria-hidden', 'true');
        input.setAttribute('name', this.name);
        input.tabIndex = -1;

        this._fallbackControl = input;
      }
    }

    return FormControllableElement;
  };
