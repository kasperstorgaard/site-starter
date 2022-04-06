import { html, nothing, render, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { LightboxElement } from './lightbox';
import './lightbox';
import './lightbox.scss';

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
      <div aria-label="1 of 4">
        ${getImage(0)}
      </div>
      <div aria-label="2 of 4">
        ${getImage(1)}
      </div>
      <div aria-label="3 of 4">
        ${getImage(2)}
      </div>
      <div aria-label="4 of 4">
        ${getImage(3)}
      </div>
      `}
    </sg-lightbox>
    `

    render(template, container);
    return container;
  }

  fn.args = options;
  return fn;
}

export const Primary = lightboxFactory({ isOpen: false });
export const OddSizes = lightboxFactory({ isOpen: false }, {
  inner: html`
  <div aria-label="1 of 6">
    ${getImage(0, 400, 400)}
  </div>
  <div aria-label="2 of 6">
    ${getImage(1, 650, 100)}
  </div>
  <div aria-label="3 of 6">
    ${getImage(2, 450, 550)}
  </div>
  <div aria-label="4 of 6">
    ${getImage(3, 1200, 800)}
  </div>
  <div aria-label="5 of 6">
    ${getImage(4, 50, 50)}
  </div>
  <div aria-label="6 of 6">
    ${getImage(5, 300, 200)}
  </div>
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
    <div aria-label="1 of 4">
      ${getImage(0)}
      <a href="#">read the article</a>
    </div>
    <div aria-label="2 of 4">
      ${getImage(1)}
      <a href="#">read the article</a>
    </div>
    <div aria-label="3 of 4">
      ${getImage(2)}
      <a href="#">read the article</a>
    </div>
    <div aria-label="4 of 4">
      ${getImage(3)}
      <a href="#">read the article</a>
    </div>
  </sg-lightbox>
  `

  render(template, container);
  return container;
}

function getImage(index = 0, width = 1200, height = 800) {
  const cacheBust = Math.ceil(Math.random() * 10000);

  const images = new Map<number, string>();
  images.set(1012, 'Man and dog sitting casually on an overgrown lawn looking off in the distance')
  images.set(1010, 'Dark skinned child sitting in a comfy bed, reading an old bible');
  images.set(1011, 'Woman canoeing over a calm lake in the woods while the sun is setting');
  images.set(1006, 'Person sitting on a mountain top with their dog, looking over a cloudy forest');
  images.set(1029, 'Aerial view of central park on a cloudy summer morning');
  images.set(1040, 'Old european fairy tale castle overlooking woods, fields and a river');

  const image = Array.from(images)[index];

  return html`
    <img
      src="https://picsum.photos/id/${image[0]}/${width}/${height}?_cb=${cacheBust}"
      alt="${image[1]}"
      width=${width}
      height=${height}
      loading=${index === 0 ? 'eager' : 'lazy'}
    >
  `;
}
