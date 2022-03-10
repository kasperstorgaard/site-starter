import { html, render } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js'
import { AutocompleteElement } from './autocomplete';
import './autocomplete';
import './autocomplete.scss';

import cities from './cities.json';

export default {
  title: 'Autocomplete',
};

export const Primary = () => {
  const container = document.createElement('div');
  const autocomplete = createRef<AutocompleteElement>();


  render(html`
    <sg-autocomplete ${ref(autocomplete)}>
      <input slot="input" list="autocomplete" />
      <datalist id="autocomplete" ></datalist>
    </sg-autocomplete>
  `, container);

  autocomplete.value!.addEventListener('query', (event: CustomEvent) => {
    const value = event.detail as string;

    const target = value.toLowerCase();

    autocomplete.value!.items = cities
      .filter(city =>
        city.name.toLowerCase().includes(target) ||
        city.country.toLowerCase().includes(target)
      )
      .map(city => ({
        key: city.geonameid.toString(),
        text: city.name,
        value: city.name,
      }));
  });

  return container;
}
