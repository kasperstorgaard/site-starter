import { html, nothing, render, TemplateResult } from 'lit';
import './modal';
import './modal.scss';

export default {
  title: 'Modal',
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

function modalFactory(options?: Options, content?: Content) {
  const fn = (args?: Options) => {
    const container = document.createElement('div');

    const template = html`
    <button
      class="sg-button"
      @click=${() => document.querySelector('sg-modal')?.setAttribute('is-open', '')}
    >open</button>
    ${content?.outer ?? nothing}
    <sg-modal ?is-open=${args.isOpen} direction=${args.direction ?? 'up'}>
      ${content?.header ? content.header : nothing }
      ${content?.inner ?? 'hello, I\m a modal :\'{D'}
      ${content?.footer ? content.footer : nothing }
    </sg-modal>
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

export const Primary = modalFactory({ isOpen: false });
export const PreOpened = modalFactory({ isOpen: true });
export const Down = modalFactory({ direction: 'down', isOpen: false });
export const Header = modalFactory({}, {
  header: html`<h2 slot="header">header</h2>`,
});
export const Footer = modalFactory({}, {
  footer: html`<button class="sg-button" theme="primary" slot="footer">sign me up</button>`,
});
export const HeaderAndFooter = modalFactory({}, {
  header: html`<h2 slot="header">sign me up</h2>`,
  footer: html`<button class="sg-button" theme="primary" slot="footer">sign me up</button>`,
});

export const ScrollLock = modalFactory(
  { isOpen: false},
  { outer: html`
    <div style="height: 200vh; background: var(--cyan-1); margin-top: 1em; padding: 1em;">
      This is a a test to make sure the underlying page does not scroll when the modal is open
    </div>`,
  }
);

