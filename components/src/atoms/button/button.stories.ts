import { html, render } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import './button.scss';

export default {
  title: 'Design System/Atoms/Button',
};


interface Options {
  theme?: string;
  text: string;
  size?: string;
  inverse?: boolean;
}

function renderButton(args?: Options) {
  return html`
    <button
      class=${classMap({ 'sg-button': true })}
      theme=${args.theme ?? ''}
      ?inverse=${args.inverse}
      size=${args.size}
    >${args?.text ?? 'click'}</button>
  `;
}

function buttonFactory(options: Options) {
  const fn = (args: any) => {
    const container = document.createElement('div');
    render(renderButton(args), container);
    return container;
  }

  fn.args = options;
  fn.argTypes = {
    ...fn.argTypes,
    theme: {
      options: ['primary', 'secondary'],
      control: 'select',
      defaultValue: 'multi',
    },
  };

  return fn;
}

function buttonGrid() {
  const sizes = ['big', 'small'];

  const states = ['default', 'big', 'small', 'inverse'];
  const themes: string[] = ['default', 'primary', 'secondary'];

  const container = document.createElement('div');

  render(html`
    <table class="sb-grid">
      <thead>
        <tr>
          ${map(['\\', ...states], attribute => html`<th>${attribute}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${map(themes, (theme) => html`
          <tr>
            ${map(['', ...states], (state, index) => html`
            <td>${index === 0 ?
              theme :
              renderButton({
                text: state === 'small' ? 'yes' : 'click me',
                theme,
                size: sizes.includes(state) ? state : undefined,
                inverse: state === 'inverse',
              })
            }</td>
            `)}
          </tr>
        `)}
      </tbody>
    </table>
  `, container);

  return container;
}

export const Default = buttonFactory({ text: 'default' });
export const Primary = buttonFactory({ text: 'primary', theme: 'primary' });
export const Secondary = buttonFactory({ text: 'secondary', theme: 'secondary' });

export const Grid = buttonGrid;
