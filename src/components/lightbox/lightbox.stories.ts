import { html, nothing, render, TemplateResult } from 'lit';
import './lightbox';

export default {
  title: 'Lightbox',
};

interface Options {
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

    const template = html`
    <button
      class="sg-button"
      @click=${() => document.querySelector('sg-lightbox')?.setAttribute('is-open', '')}
    >open</button>
    ${content?.outer ?? nothing}
    <sg-lightbox ?is-open=${args.isOpen} direction=${args.direction ?? 'up'}>
      ${content?.inner ?? html`
        ${getImage()}
        ${getImage()}
        ${getImage()}
        ${getImage()}
      `}
    </sg-lightbox>
    `

    render(template, container);
    return container;
  }

  fn.args = options;
  fn.argTypes = {
    ...fn.argTypes,
    direction: {
      options: ['up', 'down'],
      control: 'select',
      defaultValue: 'up',
    },
  };

  return fn;
}

function getImage(width = 1200, height = 800) {
  const cacheBust = Math.floor(Math.random() * 10000);
  return html`<img src="https://picsum.photos/${width}/${height}?_cb=${cacheBust}" alt="automatically generated image for testing purposes">`;
}

export const Primary = lightboxFactory({ isOpen: false });
export const OddSizes = lightboxFactory({ isOpen: false }, {
  inner: html`
  ${getImage(400, 400)}
  ${getImage(650, 100)}
  ${getImage(450, 550)}
  ${getImage(1200, 800)}
  ${getImage(50, 50)}
  ${getImage(300, 200)}
  `
});
export const PreOpened = lightboxFactory({ isOpen: true });
export const Down = lightboxFactory({ direction: 'down', isOpen: false });

export const UseScrollLock = lightboxFactory(
  { isOpen: false},
  { outer: html`
    <div style="height: 300vh; background: var(--gradient-1); padding: var(--size-5); color: var(--gray-1)">
      try to scroll while closed
    </div>`,
  }
);

