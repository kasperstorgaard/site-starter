import { html, render } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { SnackbarElement } from './snackbar';
import './snackbar';
import './snackbar.scss';

export default {
  title: 'Design System/Atoms/Snackbar',
  args: {
    timeout: 'medium',
  },
  argTypes: {
    timeout: {
      control: 'select',
      options: ['short', 'medium', 'long'],
    }
  }
};

export function Primary() {
  const container = document.createElement('div');
  const snackbar = createRef<SnackbarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => {
      snackbar.value.show();
    }}
  >Show notification</button>
  <sg-snackbar
    ${ref(snackbar)}
  >
    Document saved 👍
  </sg-snackbar>
  `;


  render(template, container);
  return container;
}

export function Interaction() {
  const container = document.createElement('div');
  const snackbar = createRef<SnackbarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => snackbar.value.show()}
  >Show notification</button>
  <p style="background: var(--red-1); padding: 1em; margin-top: 1em;">
    Please don't do this, a snackbar is a temporary info message,
    and should never be relied upon for any user interaction.
    (except if the user wants to close it early).
  </p>
  <sg-snackbar
    ${ref(snackbar)}
  >
    <p>
      Don't use snackbar for interactible elements
      <a href="#">Please</a>
    </p>
  </sg-snackbar>
  `;


  render(template, container);
  return container;
}

export function LongDuration() {
  const container = document.createElement('div');
  const snackbar = createRef<SnackbarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => snackbar.value.show()}
  >Show notification</button>
  <sg-snackbar
    timeout="long"
    ${ref(snackbar)}
  >
    Uff, it seems like you are offline
  </sg-snackbar>
  `;


  render(template, container);
  return container;
}

export function ShortDuration() {
  const container = document.createElement('div');
  const snackbar = createRef<SnackbarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => snackbar.value.show()}
  >Show notification</button>
  <sg-snackbar
    timeout="short"
    ${ref(snackbar)}
  >
    Nice job!
  </sg-snackbar>
  `;


  render(template, container);
  return container;
}
