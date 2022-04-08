import './overlay';
import './overlay.scss';
import { html, render } from 'lit';

export default {
  title: 'Design System/Atoms/Overlay',
  args: {
    isOpen: false,
  }
};

interface Options {
  isOpen: boolean;
}

export function Primary(args?: Options) {
  const template = html`
    <button
      class="sg-button"
      @click=${() => document.querySelector('sg-overlay')?.setAttribute('is-open', '')}
    >
      Open overlay
    </button>
    <sg-overlay
      ?is-open=${args.isOpen}
      @click=${() => document.querySelector('sg-overlay')?.removeAttribute('is-open')}
    >
    </sg-overlay>
  `;
  const container = document.createElement('div');

  render(template, container);
  return container;
}

export function PreOpened(args?: Options) {
  const template = html`
    <button
      class="sg-button"
      @click=${() => document.querySelector('sg-overlay')?.setAttribute('is-open', '')}
    >
      Open overlay
    </button>
    <sg-overlay
      ?is-open=${args.isOpen}
      @click=${() => document.querySelector('sg-overlay')?.removeAttribute('is-open')}
    >
    </sg-overlay>
  `;
  const container = document.createElement('div');

  render(template, container);
  return container;
};

PreOpened.args = {
  isOpen: true,
};
