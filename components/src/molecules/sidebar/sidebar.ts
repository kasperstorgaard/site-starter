import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { Overlayable, overlayableStyles } from '../../atoms/overlay/overlayable-mixin';
import '../../atoms/overlay/overlay';

@customElement('sg-sidebar')
export class SidebarElement extends Overlayable(LitElement) {
  static styles = [
    overlayableStyles,
    getStyles(),
  ];

  @queryAssignedElements({ slot: 'header' })
  private _headerItems: Array<HTMLElement>;

  @queryAssignedElements({ slot: 'footer' })
  private _footerItems: Array<HTMLElement>;

  @property({ type: String, reflect: true })
  direction: 'left' | 'right' = 'left';

  @property({ type: String })
  closeLabel: string = 'close';

  render() {
    return html`
    <header ?hidden=${!this._headerItems.length}>
      <slot name="header"></slot>
    </header>
    <div>
      <slot></slot>
    </div>
    <footer ?hidden=${!this._footerItems.length}>
      <slot name="footer"></slot>
    </footer>
    <button
      class="close"
      @click=${this.close}
    ><span class="visually-hidden">${this.closeLabel}</span></button>
    `;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}

function getStyles() {
  return css`
  [hidden] {
    display: none;
  }

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
    position: fixed;

    display: flex;
    flex-direction: column;

    /* on mobile: 100%, on desktop: 40% */
    width: max(40%, min(460px, 100vw));
    top: 0;
    height: 100%;
    z-index: var(--level-modal);
    outline: none;

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
    border: none;
    cursor: pointer;

    transition: transform .33s var(--ease-3);
  }

  .close:before {
    content: "✕";
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

  /**
   * Overlayable animation styles are in overlayable mixin.
   */
  :host([direction=left]) {
    left: auto;
    right: 0;
  }

  :host([direction=right]) {
    left: 0;
    right: auto;
  }
  `;
}
