import { css, html, LitElement } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import animationKeyframes from '../../styles/props/animation-keyframes';

@customElement('sg-snackbar')
export class SnackbarElement extends LitElement {
  static styles = [
    animationKeyframes,
    getStyles(),
  ];

  private _timeout = 5000;
  private _open = false;
  private _hideTimer = 0;
  private _focusOrigin: HTMLElement | null = null;

  get timeout() {
    return this._timeout;
  }

  @property({ noAccessor: true })
  set timeout(value: 'short'|'medium'|'long'|number) {
    const oldVal = this._timeout;

    switch (value) {
      case 'short': {
        this._timeout = 2500;
        break;
      }
      case 'long': {
        this._timeout = 7500;
        break;
      }
      default: {
        this._timeout = parseInt(value.toString());
        break;
      }
    }

    this.requestUpdate('timeout', oldVal);
  }

  get open() {
    return this._open;
  }

  @property({ type: Boolean, reflect: true, noAccessor: true })
  set open(value: boolean) {
    const oldVal = this._open;

    if (value !== oldVal) {
      this._open = value;

      if (value) {
        this.removeAttribute('hidden');
      }

      this.requestUpdate('open', oldVal);

      if (value) {
        this.setAttribute('aria-live', 'polite');
      } else {
        this.removeAttribute('aria-live');
      }
    }
  }

  @property({ type: String })
  closeLabel = 'close';

  @queryAssignedElements()
  content: HTMLElement[];

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.open) {
      this.setAttribute('hidden', 'hidden');
    }

    this.addEventListener('animationend', () => this.toggleAttribute('hidden', !this.open));
    this.addEventListener('animationcancel', () => this.toggleAttribute('hidden', !this.open));

    document.addEventListener('focusin', this._storeFocusOrigin);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('focusin', this._storeFocusOrigin);
    this._restoreFocus();
  }

  firstUpdated(changes: Map<string, unknown>) {
    super.firstUpdated(changes);

    for (const element of this.content) {
      const focusable = findFocusableElement(element);

      if (focusable) {
        console.warn([
          `Please don\'t use interaction elements inside a snackar (ex: <${focusable.tagName.toLowerCase()}>)`,
          'A snackbar should be used for a temporary info message, and can never be relied upon for any user interaction.'
        ].join('\n'));
        break;
      }
    }
  }

  updated(changes: Map<string, unknown>) {
    super.updated(changes);

    if (changes.has('open')) {
      window.clearTimeout(this._hideTimer);

      if (this.open) {
        this._hideTimer = window.setTimeout(() => {
          this.open = false;
        }, this._timeout);
      } else {
        this._restoreFocus();
      }
    }
  }

  render() {
    return html`
    <slot></slot>
    <button
      class="close"
      @click=${this.hide}
      @focus=${this._storeFocusOrigin}
    ><span class="visually-hidden">${this.closeLabel}</span></button>
    `;
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  // keeps track of the focus origin outside of this element,
  // so we can restore focus once this is closed.
  private _storeFocusOrigin = () => {
    if (document.activeElement !== this && !this.contains(document.activeElement)) {
      this._focusOrigin = document.activeElement as HTMLElement;
    }
  }

  // restore focus to the origin element, if the focus is inside this when closing.
  private _restoreFocus() {
    // don't restore focus if the user already moved focus
    if (
      document.activeElement === this ||
      this.contains(document.activeElement) ||
      this.shadowRoot.activeElement
    ) {
      this._focusOrigin?.focus();
    }
  }
}

function getStyles() {
  return css`
    /* util, extract? */
    .visually-hidden {
      clip: rect(0 0 0 0);
      clip-path: inset(100%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    :host {
      --snackbar-pad-top: var(--size-3);
      --snackbar-pad-side: var(--size-4);

      display: flex;
      justify-content: space-between;
      align-content: center;

      position: fixed;
      bottom: var(--snackbar-pad-top);
      left: 0;
      right: 0;
      max-width: min(24rem, 100vw - var(--snackbar-pad-side) * 2);

      margin: 0 auto;
      padding: var(--snackbar-pad, var(--snackbar-pad-top) var(--snackbar-pad-side));

      background: var(--snackbar-bg, var(--gray-2));
      transform-origin: top center;
    }

    :host(:focus-visible) {
      outline: var(--blue-1);
    }

    .close {
      font-size: var(--font-size-2);
      line-height: 1.5em;

      padding: var(--snackbar-pad-top) var(--snackbar-pad-side);
      margin: calc(-1 * var(--snackbar-pad-top)) calc(-1 * var(--snackbar-pad-side));
      margin-left: var(--snackbar-pad-side);

      background: none;
      border: none;
      cursor: pointer;
    }

    .close:before {
      content: "???";
    }

    :host([open]) {
      animation:
        var(--animation-fade-in),
        var(--animation-slide-in-up);
    }

    :host(:not([open])) {
      animation:
        var(--animation-fade-out),
        var(--animation-slide-out-down);
      animation-duration: .3s;
    }
  `;
}

function findFocusableElement(element: HTMLElement) {
  if (element.tabIndex >= 0) {
    return element;
  }

  const treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    { acceptNode: (node: HTMLElement) => node.tabIndex >= 0 ?
        NodeFilter.FILTER_ACCEPT :
        NodeFilter.FILTER_SKIP,
    },
  );

  return treeWalker.nextNode() as HTMLElement;
}
