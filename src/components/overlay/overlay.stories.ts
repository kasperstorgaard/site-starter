import { OverlayElement } from './overlay';
import './overlay';
import './overlay.scss';
import { html, render } from 'lit-html';

export default {
  title: 'Overlay',
};

interface Options {
  isOpen: boolean;
}

function overlayFactory(options?: Options) {
  const fn = (args?: Options) => {
    const template = html`
      <button
        @click=${() => document.querySelector('sg-overlay')?.setAttribute('is-open', '')}
      >
        open
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

  fn.args = options;
  return fn;
};

export const Primary = overlayFactory({ isOpen: false });
export const PreOpened = overlayFactory({ isOpen: true });
