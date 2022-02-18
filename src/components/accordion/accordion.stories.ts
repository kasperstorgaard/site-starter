import { html, render } from 'lit';
import { map } from 'lit-html/directives/map.js';
import { range } from 'lit-html/directives/range.js';
import './accordion';
import './accordion.scss';

export default {
  title: 'Accordion',
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
            <span>This is some content</span>
          </details>
        `)}
      </sg-accordion>
    `, container);

    return container;
  }

  fn.args = options;
  fn.argTypes = {
    ...fn.argTypes,
    mode: {
      options: ['multi', 'single'],
      control: 'select',
      defaultValue: 'multi',
    },
  };

  return fn;
}

export const Primary = accordionFactory({ numberOfItems: 2 });
export const ManyItems = accordionFactory({ numberOfItems: 10 });
export const SingleMode = accordionFactory({ numberOfItems: 5, mode: 'single' });
