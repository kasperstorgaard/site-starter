import { html, nothing, render, TemplateResult } from 'lit';
import './sidebar';
import './sidebar.scss';

export default {
  title: 'Sidebar',
};

interface Options {
  isOpen?: boolean;
}

interface Content {
  outer?: TemplateResult;
  header?: TemplateResult;
  inner?: TemplateResult;
  footer?: TemplateResult;
}

function sidebarFactory(options?: Options, content?: Content) {
  const fn = (args?: Options) => {
    const container = document.createElement('div');

    const template = html`
    <button
      class="sg-button"
      @click=${() => document.querySelector('sg-sidebar')?.setAttribute('is-open', '')}
    >open</button>
    ${content?.outer ?? nothing}
    <sg-sidebar ?is-open=${args.isOpen}>
      ${content?.header ? html`<div slot="header">${content.header}</div>` : nothing}
      ${content?.inner ?? 'hi from the sidebar :)'}
      ${content?.footer ? html`<div slot="footer">${content.footer}</div>` : nothing}
    </sg-sidebar>
    `

    render(template, container);
    return container;
  }

  fn.args = options;
  return fn;
}

export const Primary = sidebarFactory({ isOpen: false });
export const PreOpened = sidebarFactory({ isOpen: true });

export const Header = sidebarFactory({}, { header: html`header` });
export const Footer = sidebarFactory({}, { footer: html`footer` });
export const HeaderAndFooter = sidebarFactory({},
  {
    header: html`header`,
    footer: html`footer`
  }
);

export const UseScrollLock = sidebarFactory(
  { isOpen: false},
  { outer: html`
    <div style="height: 300vh; background: var(--gradient-1); padding: var(--size-5); color: var(--gray-1)">
      try to scroll while closed
    </div>`,
  }
);

