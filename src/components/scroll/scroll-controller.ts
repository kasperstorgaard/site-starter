import { ReactiveController } from '@lit/reactive-element';
import { LitElement } from 'lit';
import { debounce } from 'throttle-debounce';

interface ScrollOptions {
  behavior: 'instant'|'smooth';
}

interface ScrollHost extends LitElement {
  scrollContainer: HTMLElement | null;
}

export class ScrollController<T extends ScrollHost> implements ReactiveController {
  private host: T;

  private _index: number | null = null;
  set index(value: number) {
    if (this._index !== value) {
      this._index = value;
      this.host.requestUpdate();
    }
  }
  get index() { return this._index ?? 0 };

  private _isAtEnd: boolean | null = null;
  set isAtEnd(value: boolean) {
    if (this._isAtEnd !== value) {
      this._isAtEnd = value;
      this.host.requestUpdate();
    }
  }
  get isAtEnd() { return this._isAtEnd ?? false };

  get isAtStart() { return this.index === 0; }

  private get _items() {
    if (!this.host.scrollContainer) {
      return [];
    }

    const children = Array.from(this.host.scrollContainer?.children ?? []);
    if (children.length === 1 && children[0].tagName === 'SLOT') {
      const slot = children[0] as HTMLSlotElement;
      return slot.assignedElements();
    }

    return children;
  }

  // not sure why, but the typings are off when setting host: ScrollHost
  constructor(host: T, options?: {
    index?: number,
  }) {
    this.host = host;
    host.addController(this);

    if (options?.index != null) {
      this.index = options.index;
    }
  }

  hostConnected(): void {
    this.goTo(this.index, { behavior: 'instant' });
  }

  hostUpdated(): void {
    this.host.scrollContainer?.removeEventListener('scroll', this._scrollHandler);
    this.host.scrollContainer?.addEventListener('scroll', this._scrollHandler);
  }

  hostDisconnected(): void {
    this.host.scrollContainer?.removeEventListener('scroll', this._scrollHandler);
  }

  goTo(target: number, options: {
    behavior?: 'instant'|'smooth'
  }) {
    if (!this.host.scrollContainer) {
      return;
    }

    if (options?.behavior === 'instant') {
      this.index = target;
      this.host.requestUpdate();
    }

    const prevIndex = this._findIndex();

    // If the value was not changed, stop here.
    if (target === prevIndex) {
      return;
    }

    // Make sure the value is not outside bounds.
    if (target > this._items.length - 1 || target < 0) {
      return;
    }

    const prevEl = this._items[prevIndex];
    const targetEl = this._items[target];

    const left =
      targetEl.getBoundingClientRect().x -
      prevEl.getBoundingClientRect().x;

    const behavior = (options?.behavior ?? 'smooth') as ScrollBehavior;
    this.host.scrollContainer.scrollBy({ left, behavior });
  }

  goBack(options?: ScrollOptions) {
    this.goTo(this.index - 1, options);
  }

  goForward(options?: ScrollOptions) {
    this.goTo(this.index + 1, options);
  }

  private _findIndex() {
    if (!this.host.scrollContainer) {
      return 0;
    }

    if (!this._items.length) {
      return 0;
    }

    const scrollLeft = this.host.scrollContainer.scrollLeft;
    if (scrollLeft === 0) {
      return 0;
    }

    const innerBox = this.host.scrollContainer.getBoundingClientRect();
    const offset = innerBox.left;

    for (let idx = 0; idx < this._items.length; idx++) {
      const child = this._items[idx];
      const rect = child.getBoundingClientRect();
      if (rect.left >= offset) {
        return idx;
      }
    }

    return this._items.length - 1;
  }

  private _scrollHandler = debounce(20, () => {
    this.index = this._findIndex();
    this.isAtEnd = isScrollAtEnd(this.host.scrollContainer);

    this.host.requestUpdate();
  });
}

function isScrollAtEnd(element: HTMLElement) {
  return element.offsetWidth + element.scrollLeft >= element.scrollWidth - 5;
}
