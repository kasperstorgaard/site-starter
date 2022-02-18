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
  inner?: TemplateResult;
}

function sidebarFactory(options?: Options, content?: Content) {
  const fn = (args?: Options) => {
    const container = document.createElement('div');

    const template = html`
    <button @click=${() => document.querySelector('sg-sidebar')?.setAttribute('is-open', '')}>open</button>
    ${content?.outer ?? nothing}
    <sg-sidebar ?is-open=${args.isOpen}>
      ${content?.inner ?? 'hi from the sidebar :)'}
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

export const UseScrollLock = sidebarFactory(
  { isOpen: false},
  { outer: html`
    <div style="height: 300vh; background: var(--gradient-1); padding: var(--size-5); color: var(--gray-1)">
      try to scroll while closed
    </div>`,
  }
);

