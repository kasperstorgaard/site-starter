import { LitElement, ReactiveController } from 'lit';
import { getChildrenIncludingSlotted, isElementVisible } from '../../helpers/element-helpers';

export interface FocusTrapElement extends LitElement {
  isFocusTrapped: boolean;
  canElementReceiveFocus?: (element: HTMLElement) => boolean;
}

export class FocusTrapController<T extends FocusTrapElement> implements ReactiveController {
  private _host: T;
  private _focusOrigin: HTMLElement | null = null;
  private _isActive: boolean = false;

  constructor(host: T) {
    this._host = host;
    this._host.addController(this);
  }

  hostUpdated(): void {
    if (this._host.isFocusTrapped && !this._isActive) {
      this._trapFocus();
    } else if (!this._host.isFocusTrapped && this._isActive) {
      this._restoreFocus();
    }
  }

  hostDisconnected(): void {
    this._restoreFocus();
  }

  private _trapFocus() {
    this._focusOrigin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this._host.addEventListener('keydown', this._handleTabs);
    this._isActive = true;
  }

  private _restoreFocus() {
    this._focusOrigin?.focus();
    this._host.removeEventListener('keydown', this._handleTabs);
    this._isActive = false;
  }

  private _handleTabs = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') {
      return;
    }

    event.preventDefault();
    const direction = event.shiftKey ? 'back' : 'forward';

    this._focusNext(direction);
  }

  private _focusNext(direction: 'forward'|'back' = 'forward') {
    const tabbableChildren = this._getTabbableChildren(this._host.shadowRoot);

    const activeElement = document.activeElement === this._host ?
      this._host.shadowRoot.activeElement :
      document.activeElement;

    // if we somehow have no current focus, focus the first or last, depending on direction wanted
    if (!activeElement) {
      const target = direction === 'back' ? tabbableChildren.length - 1 : 0;

      // this can sometimes be null when there is a race condition in animations
      if (tabbableChildren[target]) {
        tabbableChildren[target].focus();
      }
    // otherwise focus the next in order, wrapping around the list if needed.
    } else {
      const index = tabbableChildren.indexOf(activeElement as HTMLElement);
      const offset = direction === 'forward' ? 1 : -1;
      const target = (index + offset + tabbableChildren.length) % tabbableChildren.length;

      // this can sometimes be null when there is a race condition in animations
      if (tabbableChildren[target]) {
        tabbableChildren[target].focus();
      }
    }
  }


  // Gets the tabable elements of a shadow root and any elements assigned to slots.
  // Optionally restricted by a being visible within a container.
  private _getTabbableChildren(root: Element | ShadowRoot): HTMLElement[] {
    const children = getChildrenIncludingSlotted(root);


    return children
      // make sure the element can receive tabs.
      .filter(element => element.tabIndex >= 0)
      // filter out element that can't recieve focus by either
      .filter(element => this._host.canElementReceiveFocus ?
        // a) custom function
        this._host.canElementReceiveFocus(element) :
        // simple visibility check
        element.offsetWidth > 0 && element.offsetHeight > 0
      );
  }
}
