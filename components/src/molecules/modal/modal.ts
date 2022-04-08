import { css, html, LitElement } from 'lit';

import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Overlayable, overlayableStyles } from '../../atoms/overlay/overlayable-mixin';
import '../../atoms/overlay/overlay';

@customElement('sg-modal')
export class ModalElement extends Overlayable(LitElement) {
  static styles = [
    ...overlayableStyles,
    getStyles()
  ];

  @queryAssignedElements({ slot: 'header' })
  private _headerItems: Array<HTMLElement>;

  @queryAssignedElements({ slot: 'footer' })
  private _footerItems: Array<HTMLElement>;

  @property({ type: String })
  closeLabel = 'close';

  @property({ type: String })
  title: string;

  render() {
    return html`
    <header ?hidden=${!this._headerItems.length && !this.title}>
      ${when(this._headerItems.length || this.title, () => this.closeSpacerTemplate)}
      <slot
        name="header"
        @slotchange=${() => this.requestUpdate()}
      >${when(this.title, () => html`<h1>${this.title}</h1>`)}</slot>
    </header>
    <div class="body">
      ${when(!this._headerItems.length && !this.title, () => this.closeSpacerTemplate)}
      <slot></slot>
    </div>
    <footer ?hidden=${!this._footerItems.length}>
      <slot
        name="footer"
        @slotchange=${() => this.requestUpdate()}
      ></slot>
    </footer>
    <button
      class="close"
      @click=${this.close}
    ><span class="visually-hidden">${this.closeLabel}</span></button>
  `;
  }

  // The close spacer ensures that the content never overlap with the close button
  private closeSpacerTemplate = html`
    <div
      class="close-pusher"
      aria-hidden="true"
    >✕</div>
  `;
}

function getStyles() {
  return css`
  [hidden] {
    display: none !important;
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
    /* on mobile: 100%, on desktop: 40% */
    --modal-size: 28rem;
    --modal-ratio: calc(4/3);
    --modal-width: min(var(--modal-size), 100vw - var(--app-gutter) * 2);
    --modal-height: min(calc(var(--modal-size) / var(--modal-ratio)), 100vh);

    --modal-pad-vertical: var(--size-3);
    --modal-pad-horizontal: var(--app-gutter);
    --modal-pad: var(--modal-pad-vertical) var(--modal-pad-horizontal);
    --modal-bg: var(--gray-0);

    position: fixed;
    display: grid;

    grid-template:
        "header" minmax(max-content, 0px)
        "body" 1fr
        "footer" minmax(0px, max-content) / 1fr;

    width: var(--modal-width);
    height: var(--modal-height);
    z-index: var(--level-modal);

    left: calc(50% - var(--modal-width) / 2);
    top: calc(50% - var(--modal-height) / 2);

    background: var(--modal-bg);
    border-radius: var(--modal-border-radius, var(--radius-1  ));
    border: var(--border-size-2) solid var(--gray-9);
    box-shadow: var(--shadow-2);
    outline: none;
  }

  .body {
    grid-area: body;
    padding: var(--modal-pad);
    overflow-y: auto;
  }

  header {
    grid-area: header;

    padding: var(--modal-pad-vertical) var(--modal-pad-horizontal);

    text-transform: uppercase;
    font-weight: var(--font-weight-5);

    border-bottom: var(--border-base);
  }

  header ::slotted(h1),
  header h1 {
    font-size: inherit;
    margin: 0;
    line-height: var(--line-height-1);
  }

  .close-pusher,
  .close {
    font-size: var(--font-size-2);

    /* Set a higher line height and padding to make it a bigger touch target */
    padding: .5em;

    /* Offset the padding to line up with top and right */
    margin: calc(-1 * var(--modal-pad-vertical) + .3em) -0.5em 0 0;
    line-height: 1em;
  }

  .close-pusher {
    visibility: hidden;
    display: block;
    float: right;
    margin-left: 1ch;
  }

  .close {
    position: absolute;
    top: var(--modal-pad-vertical);
    right: var(--modal-pad-horizontal);

    display: block;

    background: var(--modal-bg);
    border: none;
    border-radius: 5em;

    animation: var(--animate-fade-in);

    cursor: pointer;
  }

  .close:before {
    content: "✕";
  }

  .close:hover,
  .close:active {
    transform: scale(1.05);
  }

  footer {
    grid-area: footer;

    display: grid;
    grid-auto-flow: column;
    justify-content: center;

    /* ideally this should be flex, but grid gap support is better than flex gap */
    gap: var(--size-3);

    padding: var(--size-1) var(--modal-pad-horizontal);
    border-top: var(--border-base);
  }
  `;
}
