import { LitElement, ReactiveController, ReactiveElement } from 'lit';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export class ScrollLockController<T extends LitElement> implements ReactiveController {
  private _host: LitElement;
  private _property: string;

  private _enabled = false;

  public get enabled() {
    return this._enabled;
  }

  constructor(host: T, property?: keyof Exclude<T, LitElement>) {
    this._host = host;
    this._property = property as string;
  }

  hostUpdated(): void {
    if (!this._property) {
      return;
    }

    const propertyValue = Boolean(this[this._property]);
    if (this.enabled === propertyValue) {
      return;
    }

    if (propertyValue) {
      this.enable();
    } else {
      this.disable();
    }
  }

  hostDisconnected(): void {
    this.disable();
  }

  enable() {
    this._enabled = true;
    enableBodyScroll(this._host);
  }

  disable() {
    this._enabled = false;
    disableBodyScroll(this._host);
  }
}
