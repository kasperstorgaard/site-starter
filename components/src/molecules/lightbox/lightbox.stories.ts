import { html, nothing, render, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { LightboxElement } from './lightbox';
import './lightbox';

export default {
  title: 'Design System/Molecules/Lightbox',
  args: {
    index: 0,
    direction: 'up',
  },
  argTypes: {
    direction: {
      options: ['up', 'down'],
      control: 'select',
    },
  },
};

interface Options {
  index?: number;
  isOpen?: boolean;
  direction?: 'up'|'down';
}

interface Content {
  outer?: TemplateResult;
  inner?: TemplateResult;
  header?: TemplateResult;
  footer?: TemplateResult;
}

function lightboxFactory(options?: Options, content?: Content) {
  const fn = (args?: Options) => {
    const container = document.createElement('div');
    const lightbox = createRef<LightboxElement>();

    const template = html`
    <button
      class="sg-button"
      @click=${() => lightbox.value?.open()}
    >open</button>
    ${content?.outer ?? nothing}
    <sg-lightbox
      aria-label="image gallery"
      ${ref(lightbox)}
      index=${args.index}
      ?is-open=${args.isOpen}
      direction=${args.direction ?? 'up'}
    >
      ${content?.inner ?? html`
        ${getImage(0)}
        ${getImage(1)}
        ${getImage(2)}
        ${getImage(3)}
      `}
    </sg-lightbox>
    `

    render(template, container);
    return container;
  }

  fn.args = options;
  return fn;
}

function getImage(index: number, width = 1200, height = 800) {
  const cacheBust = Math.floor(Math.random() * 10000);
  return html`
    <img
      src="https://picsum.photos/${width}/${height}?_cb=${cacheBust}"
      alt="auto generated ${index}"
      loading=${index === 0 ? 'eager' : 'lazy'}
      aria-label="image ${index} of ?"
    >`;
}

export const Primary = lightboxFactory({ isOpen: false });
export const OddSizes = lightboxFactory({ isOpen: false }, {
  inner: html`
  ${getImage(0, 400, 400)}
  ${getImage(1, 650, 100)}
  ${getImage(2, 450, 550)}
  ${getImage(3, 1200, 800)}
  ${getImage(4, 50, 50)}
  ${getImage(5, 300, 200)}
  `
});
export const PreOpened = lightboxFactory({ isOpen: true, index: 1 });
export const Down = lightboxFactory({ direction: 'down', isOpen: false });

export const ScrollLock = lightboxFactory(
  { isOpen: false },
  { outer: html`
    <div style="height: 200vh; background: var(--cyan-1); margin-top: 1em; padding: 1em;">
      This is a a test to make sure the underlying page does not scroll when the modal is open
    </div>`,
  }
);

export const Links = (args?: Options) => {
  const container = document.createElement('div');
  const lightbox = createRef<LightboxElement>();

  const template = html`
    <style>
    sg-lightbox > div {
      display: grid;
      align-items: flex-end;
      justify-items: center;
    }

    sg-lightbox > div > * {
      grid-column: -1/1;
      grid-row: -1/1;
    }

    sg-lightbox > div > a {
      display: block;
      padding: var(--size-2) var(--size-3);
      background: var(--gray-1);
    }

    sg-lightbox > div > a:focus {
      outline: 1px solid var(--red-2);
    }
  </style>
  <button
    class="sg-button"
    @click=${() => lightbox.value?.open()}
  >open</button>
  <sg-lightbox
    ${ref(lightbox)}
    index=${args.index}
    ?is-open=${args.isOpen}
    direction=${args.direction ?? 'up'}
  >

    <div>
      ${getImage(0)}
      <a href="#">link</a>
    </div>
    <div>
      ${getImage(1)}
      <a href="#">link</a>
    </div>
    <div>
      ${getImage(2)}
      <a href="#">link</a>
    </div>
    <div>
      ${getImage(3)}
      <a href="#" style="grid-column: -1/1; grid-row: -1/1">link</a>
    </div>
  </sg-lightbox>
  `

  render(template, container);
  return container;
}
