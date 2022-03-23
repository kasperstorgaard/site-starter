import { LitElement, ReactiveController } from 'lit';

export interface FocusTrapElement extends LitElement {
  isFocusTrapped: boolean;
}

export class FocusTrapController<T extends FocusTrapElement> implements ReactiveController {
  private _host: T;
  private _focusOrigin: HTMLElement | null = null;
  private _isActive: boolean = false;

  constructor(host: T) {
    this._host = host;
    this._host.addController(this);

    if (!this._host.hasAttribute('tabindex')) {
      this._host.setAttribute('tabindex', '0');
    }
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
    this._host.focus();
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

    const tabbableElements = getTabbableElements(this._host.shadowRoot);
    const direction = event.shiftKey ? -1 : 1;

    // if we somehow have no current focus, focus the first or last, depending on direction wanted
    if (!document.activeElement || document.activeElement === this._host) {
      const target = direction === -1 ? tabbableElements.length - 1 : 0;
      tabbableElements[target].focus();
    // otherwise focus the next in order, wrapping around the list if needed.
    } else {
      const index = tabbableElements.indexOf(document.activeElement as HTMLElement);
      const target = (index + direction + tabbableElements.length) % tabbableElements.length;
      tabbableElements[target].focus();
    }
  }
}

// Gets the tabable elements of a shadow root and any elements assigned to slots.
function getTabbableElements(root: ShadowRoot): HTMLElement[] {
  const treeWalker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    { acceptNode: (node: HTMLElement) => node.tabIndex >= 0 || node instanceof HTMLSlotElement ?
      NodeFilter.FILTER_ACCEPT :
      NodeFilter.FILTER_SKIP,
    },
  );

  let node = treeWalker.nextNode();
  const nodes: HTMLElement[] = [];

  while (node) {
    if (node instanceof HTMLSlotElement) {
      const subNodes = node.assignedElements()
        .filter((element: HTMLElement) => element.tabIndex >= 0) as HTMLElement[];
      nodes.push(...subNodes);
    } else {
      nodes.push(node as HTMLElement);
    }

    node = treeWalker.nextNode();
  }

  return nodes;
}
