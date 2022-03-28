import { html, render } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js'
import { AutocompleteElement } from './autocomplete';
import './autocomplete';
import './autocomplete.scss';

import cities from './cities.json';

export default {
  title: 'Design System/Molecules/Autocomplete',
  args: {
    showCountr: false,
    label: 'citites',
    minlength: 2,
  },
};

interface Options {
  label?: string;
  minlength?: number,
  showCountry?: boolean,
}

const autocompleteFactory = (options?: Options) => {
  const fn = (options?: any) => {
    const container = document.createElement('div');
    const autocomplete = createRef<AutocompleteElement>();

    render(html`
      <sg-autocomplete
        name="city"
        minlength=${options.minlength}
        ${ref(autocomplete)}
      >
        <span slot="label">cities</span>
      </sg-autocomplete>
    `, container);

    autocomplete.value?.addEventListener('query', (event: CustomEvent) => {
      const value = event.detail as string;

      const target = value.toLowerCase();

      const items = cities
        .filter(city =>
          city.name.toLowerCase().includes(target) ||
          city.country.toLowerCase().includes(target)
        )
        .map(city => {
          const matcher = new RegExp(value, 'gi');

          const highlights: [number, number][] = [];

          let match: RegExpExecArray;
          while (match = matcher.exec(city.name)) {
            highlights.push([match.index, match.index + match[0].length]);
          }

          return {
            key: city.geonameid.toString(),
            text: city.name,
            highlights,
            description: options.showCountry ? city.country : undefined,
            value: city.name,
          };
        });

      autocomplete.value.items = items;
    });

    return container;
  }

  fn.args = options;

  return fn;
}

export const Primary = autocompleteFactory();
export const Description = autocompleteFactory({ showCountry: true });
export const Minlength = autocompleteFactory({ minlength: 4 });
