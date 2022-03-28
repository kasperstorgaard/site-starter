import { html, render } from 'lit';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import './accordion';
import './accordion.scss';

export default {
  title: 'Design System/Molecules/Accordion',
  args: {
    numberOfItems: 2,
    mode: 'multi',
  },
  argTypes: {
    mode: {
      options: ['multi', 'single'],
      control: 'select',
    },
  }
};

interface Options {
  numberOfItems: number;
  mode?: 'multi'|'single';
}

function accordionFactory(options: Options) {
  const fn = (args?: Options) => {
    const container = document.createElement('div');

    render(html`
      <sg-accordion mode=${args.mode ?? 'multi'}>
        ${map(range(args.numberOfItems), (_item, index) => html`
          <details>
            <summary>Item ${index}</summary>
            <span>This is some content ${index}</span>
          </details>
        `)}
      </sg-accordion>
    `, container);

    return container;
  };

  fn.args = options;
  return fn;
}

export const Primary = accordionFactory({ numberOfItems: 2 });
export const ManyItems = accordionFactory({ numberOfItems: 10 });
export const SingleMode = accordionFactory({ numberOfItems: 5, mode: 'single' });
