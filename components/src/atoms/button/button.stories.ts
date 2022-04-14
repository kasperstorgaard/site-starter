import { html, render } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import './button.scss';

export default {
  title: 'Design System/Atoms/Button',
  argTypes: {
    theme: {
      table: {
        options: ['primary', 'secondary'],
        control: 'select',
        defaultValue: 'multi',
      }
    },
  },
};

interface Options {
  theme?: string;
  text: string;
  size?: string;
  inverse?: boolean;
}

export function Default(args: Options) {
  const container = document.createElement('div');
  render(renderButton(args), container);
  return container;
}

Default.args = {
  text: 'default',
} as Options;

export function Primary(args: Options) {
  const container = document.createElement('div');
  render(renderButton(args), container);
  return container;
}

Primary.args = {
  text: 'Default',
  theme: 'primary',
} as Options;

export function Secondary(args: Options) {
  const container = document.createElement('div');
  render(renderButton(args), container);
  return container;
}

Secondary.args = {
  text: 'secondary',
  theme: 'secondary',
} as Options;


function renderButton(args?: Options) {
  return html`
    <button
      class=${classMap({
        'sg-button': true,
        '-inverse': args.inverse,
        ['-size-' + args.size]: args.size,
        ['-theme-' + args.theme]: args.theme,
      })}
    >${args?.text ?? 'click'}</button>
  `;
}

export function Overview() {
  const sizes = ['big', 'small'];
  const states = ['default', 'big', 'small', 'inverse'];
  const themes: string[] = ['default', 'primary', 'secondary'];

  const container = document.createElement('div');

  render(html`
    <div class="sb-states">
      <p>Default</p>
      <div>
        <div>
          <label>default</label>
          <button class="sg-button">sign up</button>
        </div>
        <div>
          <label>primary</label>
          <button class="sg-button -theme-primary">sign up</button>
        </div>
        <div>
          <label>secondary</label>
          <button class="sg-button -theme-secondary">sign up</button>
        </div>
        <div>
          <label>default inverse</label>
          <button class="sg-button -inverse">sign up</button>
        </div>
        <div>
          <label>primary inverse</label>
          <button class="sg-button -theme-primary -inverse">sign up</button>
        </div>
        <div>
          <label>secondary inverse</label>
          <button class="sg-button -theme-secondary -inverse">sign up</button>
        </div>
      </div>
    </div>
    <div class="sb-states">
      <p>Big</p>
      <div>
        <div>
          <label>default</label>
          <button class="sg-button -size-big">sign up</button>
        </div>
        <div>
          <label>primary</label>
          <button class="sg-button -size-big -theme-primary">sign up</button>
        </div>
        <div>
          <label>secondary</label>
          <button class="sg-button -size-big -theme-secondary">sign up</button>
        </div>
        <div>
          <label>default inverse</label>
          <button class="sg-button -size-big -inverse">sign up</button>
        </div>
        <div>
          <label>primary inverse</label>
          <button class="sg-button -size-big -theme-primary -inverse">sign up</button>
        </div>
        <div>
          <label>secondary inverse</label>
          <button class="sg-button -size-big -theme-secondary -inverse">sign up</button>
        </div>
      </div>
    </div>
    <div class="sb-states">
      <p>Small</p>
      <div>
        <div>
          <label>default</label>
          <button class="sg-button -size-small">sign up</button>
        </div>
        <div>
          <label>primary</label>
          <button class="sg-button -size-small -theme-primary">sign up</button>
        </div>
        <div>
          <label>secondary</label>
          <button class="sg-button -size-small -theme-secondary">sign up</button>
        </div>
        <div>
          <label>default inverse</label>
          <button class="sg-button -size-small -inverse">sign up</button>
        </div>
        <div>
          <label>primary inverse</label>
          <button class="sg-button -size-small -theme-primary -inverse">sign up</button>
        </div>
        <div>
          <label>secondary inverse</label>
          <button class="sg-button -size-small -theme-secondary -inverse">sign up</button>
        </div>
      </div>
    </div>
  `, container);

  return container;
}
