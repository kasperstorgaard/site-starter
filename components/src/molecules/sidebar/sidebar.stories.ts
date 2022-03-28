import { html, render } from 'lit';
import { SidebarElement } from './sidebar';
import './sidebar';
import './sidebar.scss';
import { createRef, ref } from 'lit/directives/ref.js';

export default {
  title: 'Design System/Molecules/Sidebar',
};

export function Primary() {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => sidebar.value.open()}
  >open</button>
  <sg-sidebar ${ref(sidebar)}>
    hi from the sidebar :)
  </sg-sidebar>
  `;


  render(template, container);
  return container;
}

export function PreOpened() {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => sidebar.value.open()}
  >open</button>
  <sg-sidebar is-open ${ref(sidebar)}>
    hi from the sidebar :)
  </sg-sidebar>
  `;

  render(template, container);
  return container;
}

export function HeaderAndFooter() {
  const container = document.createElement('div');
  const sidebar = createRef<SidebarElement>();

  const template = html`
  <button
    class="sg-button"
    @click=${() => sidebar.value.open()}
  >open</button>
  <sg-sidebar ${ref(sidebar)}>
    <h2 slot="header">I'm a header</h2>
    hi from the sidebar :)
    <button class="sg-button" slot="footer">continue</button>
  </sg-sidebar>
  `;

  render(template, container);
  return container;
}

export function ScrollLock() {
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
  <sg-sidebar ${ref(sidebar)}>
    hi from the sidebar :)
  </sg-sidebar>
  `;

  render(template, container);
  return container;
};
