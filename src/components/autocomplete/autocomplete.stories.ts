import { html, render } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js'
import { AutocompleteElement } from './autocomplete';
import './autocomplete';
import './autocomplete.scss';

import cities from './cities.json';

export default {
  title: 'Autocomplete',
};

interface Options {
  minlength?: number,
  showCountry?: boolean,
}

export const autocompleteFactory = (options?: Options) => {
  const fn = (options?: any) => {
    const container = document.createElement('div');
    const autocomplete = createRef<AutocompleteElement>();

    render(html`
      <sg-autocomplete
        name="city"
        ${ref(autocomplete)}
      ></sg-autocomplete>
    `, container);

    autocomplete.value?.addEventListener('query', (event: CustomEvent) => {
      const value = event.detail as string;

      const target = value.toLowerCase();

      const items = cities
        .filter(city =>
          city.name.toLowerCase().includes(target) ||
          city.country.toLowerCase().includes(target)
        )
        .map(city => ({
          key: city.geonameid.toString(),
          text: city.name,
          description: options.showCountry ? city.country : undefined,
          value: city.name,
        }));

      autocomplete.value.items = items;
    });

    return container;
  }

  fn.args = options;
  fn.argTypes = {
    ...fn.argTypes,
    minlength: {
      defaultValue: 2,
    },
  };

  return fn;
}

export const Primary = autocompleteFactory();
export const Description = autocompleteFactory({ showCountry: true });
export const Minlength = autocompleteFactory({
  minlength: 4
});
