import { html, render } from 'lit';
import { SidebarElement } from './sidebar';
import './sidebar';
import './sidebar.scss';
import { createRef, ref } from 'lit/directives/ref.js';

export default {
  title: 'Design System/Molecules/Sidebar',
  args: {
    direction: 'right',
    isOpen: false,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right'],
    }
  }
};

interface Options {
  direction: 'left'|'right';
  isOpen: boolean;
}

export function Primary(options?: Options) {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    ?is-open=${options?.isOpen}
    direction=${options?.direction}
    @click=${() => sidebar.value.open()}
  >open</button>
  <sg-sidebar ${ref(sidebar)}>
    hi from the sidebar :)
  </sg-sidebar>
  `;


  render(template, container);
  return container;
}

export function Left(options: Options) {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    ?is-open=${options?.isOpen}
    direction=${options?.direction}
    @click=${() => sidebar.value.open()}
  >open</button>
  <sg-sidebar ${ref(sidebar)}>
    hi from the sidebar :)
  </sg-sidebar>
  `;


  render(template, container);
  return container;
}

export function PreOpened(options?: Options) {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => sidebar.value.open()}
  >open</button>
  <sg-sidebar
    ?is-open=${options?.isOpen ?? true}
    direction=${options?.direction}
    ${ref(sidebar)}
  >
    hi from the sidebar :)
  </sg-sidebar>
  `;

  render(template, container);
  return container;
}

PreOpened.args = {
  isOpen: true,
};

export function HeaderAndFooter(options?: Options) {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => sidebar.value.open()}
  >open</button>
  <sg-sidebar
    ${ref(sidebar)}
    ?is-open=${options?.isOpen}
    direction=${options?.direction}
  >
    <h2 slot="header">I'm a header</h2>
    hi from the sidebar :)
    <button class="sg-button" slot="footer">continue</button>
  </sg-sidebar>
  `;

  render(template, container);
  return container;
}

export function ScrollLock(options?: Options) {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => sidebar.value.open()}
  >open</button>
  <div style="height: 200vh; background: var(--cyan-1); margin-top: 1em; padding: 1em;">
    This is a test to see that scrolling while the sidebar is open, does not scroll the underlying page.
  </div>
  <sg-sidebar
    ${ref(sidebar)}
    ?is-open=${options?.isOpen}
    direction=${options?.direction}
  >
    hi from the sidebar :)
  </sg-sidebar>
  `;

  render(template, container);
  return container;
};
