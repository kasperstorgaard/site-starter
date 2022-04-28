import { css, html, LitElement } from 'lit';

import { choose } from 'lit/directives/choose.js'
import { map } from 'lit/directives/map.js';
import { customElement } from 'lit/decorators.js';
import { LocationsListController } from '../../api/web/locations/list/location-list.controller';

@customElement('sg-locations-list')
export class LocationsList extends LitElement  {
  static styles = [
    getStyles()
  ];

  controller: LocationsListController;

  constructor() {
    super();

    this.controller = new LocationsListController(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.controller.fetch();
  }

  render() {
    return html`
    ${choose(this.controller.state, [
      ['initial', () => html`<p>initial</p>`],
      ['loading', () => html`<p>loading</p>`],
      ['error', () => html`<p>error: ${this.controller.error.message}</p>`],
      ['ready', () => html`
        <ul>
          ${map(this.controller.data, item => html`
          <li>${item.name}</li>
          `)}
        </ul>
      `]
    ])}
  `;
  }
}

function getStyles() {
  return css`
  [hidden] {
    display: none !important;
  }
  `;
}
