import { html, nothing, render, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import './modal';
import { ModalElement } from './modal';
import './modal.scss';

export default {
  title: 'Design System/Molecules/Modal',
  args: {
    direction: 'up',
    isOpen: false,
  },
  argTypes: {
    direction: {
      options: ['up', 'down', 'left', 'right'],
      control: 'select',
    },
  }
};

interface Options {
  isOpen?: boolean;
  direction?: 'up'|'down'|'left'|'right';
  title: string;
}

export function Primary(args?: Options) {
  const container = document.createElement('div');
  const modal = createRef<ModalElement>();

  const template = html`
    <button
      class="sg-button"
      @click=${() => modal.value?.open()}
    >open the modal</button>
    <sg-modal
      ${ref(modal)}
      ?is-open=${args.isOpen}
      direction=${args.direction ?? 'up'}>
      <p>A modal is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.</p>
    </sg-modal>
  `;

  render(template, container);
  return container;
}

Primary.args = {
  title: 'What is a modal?'
}

export function PreOpened(args?: Options) {
  const container = document.createElement('div');
  const modal = createRef<ModalElement>();

  const template = html`
    <button
      class="sg-button"
      @click=${() => modal.value?.open()}
    >open the modal</button>
    <sg-modal
      ${ref(modal)}
      ?is-open=${args.isOpen}
      direction=${args.direction}
    >
      <h1>About Cookies on This Site</h1>
      <p>Cookies ensure our site works (Required cookies). We also offer "Functional" cookies that will personalize your visit so you are receiving the most relevant Auth0 content, and will give our internal sales teams insight into how we can help you solve identity. We also offer cookies to count visitors and optimize site performance (Performance Cookies), and Targeting Cookies that will deliver Auth0 ads to you.</p>
      <p>Please choose below between "Accept All" "Required Only" "More Choices". By clicking "Accept All' you will allow the use of these cookies. Your settings can be changed, including withdrawing your consent at any time. You can read about our complete cookie policies and overall privacy policies at any time by visiting here.A modal is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.</p>
      <button
        class="sg-button"
        slot="footer"
        @click=${() => modal.value?.close()}
      >I accept...</button>
    </sg-modal>
  `;

  render(template, container);
  return container;
}

PreOpened.args = {
  title: 'About Cookies on This Site',
  isOpen: true,
}

export function Directions(args?: Options) {
  const container = document.createElement('div');
  const modal = createRef<ModalElement>();

  const template = html`
    <p>
      Modals can be configured to open from all 4 directions:<br />
      up (default), down, left and right.
    </p>
    <button
      class="sg-button"
      @click=${() => modal.value?.open()}
    >open the modal</button>
    <sg-modal
      ${ref(modal)}
      title=${args.title}
      ?is-open=${args.isOpen}
      direction=${args.direction}>
      <p>
        Up, Up, Down, Down, Left, Right, Left, Right, B, A. It’s called the Konami Code, and it often meant the difference between life and death in a video game back in the 1980s.
      </p>
      <p>
        Perform those button presses in the right sequence, and you’ll unlock cheats that help you win. But recently, the code has grown into a wider pop-culture reference, and you might be curious about how it got started. Let’s take a look.
      </p>
    </sg-modal>
  `;

  render(template, container);
  return container;
}

Directions.args = {
  title: 'WHAT IS THE KONAMI CODE, AND HOW DO YOU USE IT?',
  direction: 'down',
};

// export const Header = modalFactory({}, {
//   header: html`<h2 slot="header">header</h2>`,
// });
// export const Footer = modalFactory({}, {
//   footer: html`<button class="sg-button" theme="primary" slot="footer">sign me up</button>`,
// });
// export const HeaderAndFooter = modalFactory({}, {
//   header: html`<h2 slot="header">sign me up</h2>`,
//   footer: html`<button class="sg-button" theme="primary" slot="footer">sign me up</button>`,
// });

export function ScrollLock(args?: Options) {
  const container = document.createElement('div');
  const modal = createRef<ModalElement>();

  const template = html`
    <p>
      When scrolling some modal content, the underlying page needs to stay still,
      otherwise the user can lose track of where they were at before opening it.
    </p>
    <button
      class="sg-button"
      @click=${() => modal.value?.open()}
    >open the modal</button>
    <div style="height: 200vh; background: var(--cyan-1); margin-top: 1em; padding: 1em;">
    </div>
    <sg-modal
      ${ref(modal)}
      title=${args.title}
      ?is-open=${args.isOpen}
      direction=${args.direction}
    >
      <h1>What Are Cookies? The Good and the Bad of Browser Cookies</h1>
      <p>You can’t visit a website these days without getting one of those troubling notifications. You know: “This site uses cookies..." A pop-up window implores you to accept or reject cookies. The website may offer you an opportunity to accept all cookies or no cookies or just certain kinds of cookies. And it demands an answer.</p>
      <p>It’s all quite alarming.</p>
      <p>Here’s what you need to know: While cookies can compromise your presumption of digital privacy in unnerving ways, they can’t infect your system with viruses or <a href="https://dataprot.net/antivirus/best-malware-removal/">other kinds of malware</a>.</p>
    </sg-modal>
  `;

  render(template, container);
  return container;
}
