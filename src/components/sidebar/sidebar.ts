import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { Overlayable } from '../overlay/overlayable-mixin';
import '../overlay/overlay';

@customElement('sg-sidebar')
export class SidebarElement extends Overlayable(LitElement) {
  static styles = [getStyles()];

  @queryAssignedElements({ slot: 'header' })
  private _headerItems: Array<HTMLElement>;

  @queryAssignedElements({ slot: 'footer' })
  private _footerItems: Array<HTMLElement>;

  @property({ type: String, reflect: true })
  dir: 'left'|'right' = 'left';

  @property({ type: Boolean, reflect: true, attribute: 'should-animate' })
  animates = false;

  @property({ type: String })
  closeLabel: string = 'close';

  render() {
    return html`
    <header ?hidden=${!this._headerItems.length}>
      <slot name="header"></slot>
    </header>
    <button
      class="close"
      @click=${this.close}
      aria-label=${this.closeLabel}
    >&#x2715</button>
    <div>
      <slot></slot>
    </div>
    <footer ?hidden=${!this._footerItems.length}>
      <slot name="footer"></slot>
    </footer>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('animationend', () => this.animates = false);
    this.addEventListener('animationcancel', () => this.animates = false);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'complementary');
    }
  }

  updated(props: PropertyValues) {
    super.updated(props)

    if (props.has('isOpen') && props.get('isOpen') != null) {
      this.animates = true;
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

function getStyles() {
  return css`
  [hidden] {
    display: none;
  }

  :host {
    position: fixed;

    display: flex;
    flex-direction: column;

    /* on mobile: 100%, on desktop: 40% */
    width: max(40%, min(460px, 100vw));
    top: 0;
    height: 100%;
    z-index: var(--level-modal);

    background: var(--sidebar-bg, white);
  }

  header {
    padding: var(--sidebar-header-pad, var(--size-3) var(--app-gutter));

    text-transform: uppercase;
    font-weight: var(--font-weight-5);

    border-bottom: var(--border-base);
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;

    padding: var(--sidebar-header-pad, var(--size-3) var(--app-gutter));

    font-size: var(--font-size-2);
    line-height: 1.5em;

    background: none;
    outline: none;
    border: none;

    transition: transform .33s var(--ease-3);
  }

  :host > div {
    flex-grow: 1;
    padding: var(--sidebar-pad, var(--size-4) var(--app-gutter));
  }

  footer {
    display: grid;
    /* ideally this should be flex, but grid gap support is better than flex gap */
    grid-auto-flow: column;
    gap: var(--size-3);
    justify-content: center;

    padding: var(--sidebar-footer-pad, var(--size-3) var(--app-gutter));

    border-top: var(--border-base);
  }

  /* hide when not open OR animating */
  :host(:not([is-open], [should-animate])) {
    display: none;
  }

  :host([dir=left]) {
    left: auto;
    right: 0;
  }

  :host([dir=left][is-open][should-animate]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-left);
  }

  :host([dir=left]:not([is-open])[should-animate]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-right);
  }

  :host([dir=right]) {
    left: 0;
    right: auto;
  }

  :host([dir=right][is-open][should-animate]) {
    animation:
      var(--animation-fade-in),
      var(--animation-slide-in-right);
  }

  :host([dir=right]:not([is-open])[should-animate]) {
    animation:
      var(--animation-fade-out),
      var(--animation-slide-out-left);
  }
  `;
}
