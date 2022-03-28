import { LitElement, ReactiveController } from 'lit';
import { getChildrenIncludingSlotted, isElementVisible } from '../../helpers/element-helpers';

export interface FocusTrapElement extends LitElement {
  isFocusTrapped: boolean;
  focusableBounds?: DOMRect | null;
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
    this._focusNext();
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
    const bounds = this._host.focusableBounds;

    const tabbableElements = getTabbableElements(this._host.shadowRoot, bounds);

    const activeElement = document.activeElement === this._host ?
      this._host.shadowRoot.activeElement :
      document.activeElement;

    // if we somehow have no current focus, focus the first or last, depending on direction wanted
    if (!activeElement) {
      const target = direction === 'back' ? tabbableElements.length - 1 : 0;

      // this can sometimes be null when there is a race condition in animations
      if (tabbableElements[target]) {
        tabbableElements[target].focus();
      }
    // otherwise focus the next in order, wrapping around the list if needed.
    } else {
      const index = tabbableElements.indexOf(activeElement as HTMLElement);
      const offset = direction === 'forward' ? 1 : -1;
      const target = (index + offset + tabbableElements.length) % tabbableElements.length;

      // this can sometimes be null when there is a race condition in animations
      if (tabbableElements[target]) {
        tabbableElements[target].focus();
      }
    }
  }
}

// Gets the tabable elements of a shadow root and any elements assigned to slots.
function getTabbableElements(root: Element | ShadowRoot, bounds?: DOMRect): HTMLElement[] {
  const elements = getChildrenIncludingSlotted(root);

  return elements
    // make sure the element can receive tabs.
    .filter(element => element.tabIndex >= 0)
    // filter out any hidden elements and elements outside bounds.
    .filter(node => isElementVisible(node, bounds));
}
