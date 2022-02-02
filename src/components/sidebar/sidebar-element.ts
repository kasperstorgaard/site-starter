import { css, html, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';
import { Overlayable } from '../overlay/overlay-mixin';

@customElement('sg-sidebar')
export class SidebarElement extends Overlayable(LitElement) {
  static styles = [getStyles()];

  render() {
    return html`
    <aside>
      <slot></slot>
    </aside>
    `;
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
  :host {
    position: fixed;
    left: auto;
    /* on mobile: 100%, on desktop: 40% */
    width: max(40%, min(460px, 100vw));
    top: 0;
    height: 100%;
    right: 0;
    background: white;

    z-index: var(--layer-2);
  }
  `;
}
