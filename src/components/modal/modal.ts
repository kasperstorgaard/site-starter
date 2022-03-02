import { css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { Overlayable, overlayableStyles } from '../overlay/overlayable-mixin';
import '../overlay/overlay';

@customElement('sg-modal')
export class ModalElement extends Overlayable(LitElement) {
  static styles = [
    overlayableStyles,
    getStyles()
  ];

  @queryAssignedElements({ slot: 'header' })
  private _headerItems: Array<HTMLElement>;

  @queryAssignedElements({ slot: 'footer' })
  private _footerItems: Array<HTMLElement>;

  @property({ type: String })
  closeLabel = 'close';

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
}

function getStyles() {
  return css`
  [hidden] {
    display: none !important;
  }

  :host {
    /* on mobile: 100%, on desktop: 40% */
    --modal-size: 28rem;
    --modal-ratio: calc(4/3);
    --modal-width: min(var(--modal-size), 100vw);
    --modal-height: min(calc(var(--modal-size) / var(--modal-ratio)), 100vh);
    --modal-pad: var(--size-4) var(--app-gutter);

    position: fixed;
    display: flex;
    flex-direction: column;

    width: var(--modal-width);
    height: var(--modal-height);
    z-index: var(--level-modal);

    left: calc(50% - (var(--modal-width) / 2));
    top: calc(50% - (var(--modal-height) / 2));

    background: var(--modal-bg, var(--gray-0));
    border-radius: var(--modal-border-radius, var(--radius-1  ));
    border: var(--border-size-2) solid var(--gray-9);
    box-shadow: var(--shadow-2);
  }

  :host > div {
    flex-grow: 1;

    padding: var(--modal-pad, var(--size-4) var(--app-gutter));
  }

  header {
    padding: var(--modal-header-pad, var(--size-3) var(--app-gutter));

    text-transform: uppercase;
    font-weight: var(--font-weight-5);

    border-bottom: var(--border-base);
  }

  header slot::slotted(*) {
    font-size: inherit;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: var(--modal-header-pad, var(--size-3) var(--app-gutter));

    font-size: var(--font-size-2);
    line-height: 1.5em;

    background: none;
    outline: none;
    border: none;

    transition: transform .33s var(--ease-3);
  }

  .close:hover,
  .close:active {
    transform: scale(1.05);
  }

  footer {
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    /* ideally this should be flex, but grid gap support is better than flex gap */

    gap: var(--size-3);

    padding: var(--modal-header-pad, var(--size-3) var(--app-gutter));
    border-top: var(--border-base);
  }
  `;
}
