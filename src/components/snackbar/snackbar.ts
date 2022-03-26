import { css, html, LitElement } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';

@customElement('sg-snackbar')
export class SnackbarElement extends LitElement {
  static styles = [
    getStyles(),
  ];

  private _hideTimer = 0;
  private _focusOrigin: HTMLElement | null = null;

  @property({ type: Number })
  timeout = 5000;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  animates = false;

  @property({ type: String })
  closeLabel = 'close';

  @queryAssignedElements()
  content: HTMLElement[];

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('animationend', () => this.animates = false);
    this.addEventListener('animationcancel', () => this.animates = false);

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

      if (changes.get('open') != null) {
        this.animates = true;
      }

      if (this.open) {
        this._hideTimer = window.setTimeout(() => {
          this.open = false;
        }, this.timeout);
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
      display: flex;
      justify-content: space-between;
      align-content: center;

      position: fixed;
      bottom: var(--snackbar-bot, var(--size-3));
      left: 0;
      right: 0;
      max-width: min(24rem, 100vw - var(--size-3) * 2);

      margin: 0 auto;
      padding: var(--snackbar-pad, var(--size-3) var(--size-4));

      background: var(--snackbar-bg, var(--gray-2));
      transform-origin: top center;
    }

    :host(:focus-visible) {
      outline: var(--blue-1);
    }

    .close {
      font-size: var(--font-size-2);
      line-height: 1.5em;

      background: none;
      border: none;
      cursor: pointer;
    }

    .close:before {
      content: "✕";
    }

    :host([open][animates]) {
      animation:
        var(--animation-fade-in),
        var(--animation-slide-in-up);
    }

    :host(:not([open])[animates]) {
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
