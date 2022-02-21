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
      ${content?.header ? html`<div slot="header">${content.header}</div>` : nothing }
      ${content?.inner ?? 'hello, I\m a modal :\'{D'}
      ${content?.footer ? html`<div slot="footer">${content.footer}</div>` : nothing }
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
  header: html`header`,
  inner: html`main content`,
});
export const Footer = modalFactory({}, {
  inner: html`main content`,
  footer: html`footer`,
});
export const HeaderAndFooter = modalFactory({}, {
  header: html`header`,
  inner: html`main content`,
  footer: html`footer`,
});

export const UseScrollLock = modalFactory(
  { isOpen: false},
  { outer: html`
    <div style="height: 300vh; background: var(--gradient-1); padding: var(--size-5); color: var(--gray-1)">
      try to scroll while closed
    </div>`,
  }
);

