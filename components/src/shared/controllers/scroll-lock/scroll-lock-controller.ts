import { LitElement, ReactiveController, ReactiveElement } from 'lit';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export interface ScrollLockElement extends LitElement {
  isScrollDisabled: boolean;
}

export class ScrollLockController<T extends ScrollLockElement> implements ReactiveController {
  private _host: T;

  constructor(host: T) {
    this._host = host;
    this._host.addController(this);
  }

  hostUpdated(): void {
    if (this._host.isScrollDisabled) {
      disableBodyScroll(this._host);
    } else {
      enableBodyScroll(this._host);
    }
  }

  hostDisconnected(): void {
    enableBodyScroll(this._host);
  }
}
