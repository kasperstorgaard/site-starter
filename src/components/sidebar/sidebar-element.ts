import { adoptStyles, css, html, LitElement, PropertyValues } from 'lit';

import { customElement, property } from 'lit/decorators.js';
import { OverlayController } from '../../base/controllers/overlay-controller';

@customElement('sg-sidebar')
export class SidebarElement extends LitElement {
  private readonly overlay = new OverlayController(this, SidebarElement);

  @property({ type: Boolean, attribute: 'is-open' })
  isOpen = false;

  protected createRenderRoot(): Element | ShadowRoot {
    return this.overlay.renderRoot;
  }

  connectedCallback() {
    super.connectedCallback();

    // TODO: make method on overlay to do this.
    this.overlay.element.addEventListener('click', () => this.overlay.close());
  }

  updated(changed: PropertyValues) {
    if (changed.has('isOpen')) {
      if (this.isOpen) {
        this.overlay.open();
      } else {
        this.overlay.close();
      }
    }
  }

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
  `;
}
