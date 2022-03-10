import { debounce } from 'throttle-debounce';
import { css, html, LitElement, render } from 'lit'
import { ItemTemplate, KeyFn, repeat } from 'lit-html/directives/repeat.js';
import { customElement, queryAssignedElements, state } from 'lit/decorators.js';

export interface Option extends Partial<Omit<Omit<HTMLOptionElement, keyof HTMLElement>, "form"|"index"|"defaultSelected">> {
  value: string;
  key: string;
  class?: string;
  style?: string;
}

/*
  AUTOCOMPLETE ELEMENT
  =================
  Progressive enhance based take on an autocomplete, using input and select.

  Sample usage:
  // TODO
*/
@customElement('sg-autocomplete')
export class AutocompleteElement extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ];

  input: HTMLInputElement | null = null;

  @queryAssignedElements({ slot: 'input', selector: 'input' })
  _inputs: HTMLInputElement[];

  @queryAssignedElements({ selector: 'datalist' })
  _datalists: HTMLDataListElement[];

  @state()
  items: Option[] = [];

  protected getKey = (item: Option, index: number) => {
    return item.key ?? `${index}|${item.value}`;
  };

  protected renderItem = (item: Option, index: number) => {
    return html`
      <option
        data-key=${this.getKey(item, index)}
        value=${item.value}
        ?selected=${item.selected ?? false}
        class=${item.class ?? ''}
        style=${item.style ?? ''}
        label=${item.label ?? ''}
      >${ item.text }</option>
    `;
  };

  protected renderItems = (items: Option[], getKey: KeyFn<Option>, renderItem: ItemTemplate<Option>) => {
    return repeat(items.slice(0, 10), getKey, renderItem);
  }

  protected updated(changed: Map<string, unknown>): void {
    super.updated(changed);

    if (changed.has('items') && this._datalists.length) {
      const itemsOutput = this.renderItems(this.items, this.getKey, this.renderItem);
      render(itemsOutput, this._datalists[0]);
    }
  }

  render() {
    return html`
      <slot name="input" @slotchange=${this._updateInputListeners}></slot>
      <slot></slot>
    `;
  }

  private _updateInputListeners() {
    this.input?.removeEventListener('input', this._query);
    this.input = this._inputs[0];
    this.input?.addEventListener('input', this._query);
  }

  private _query = debounce(20, () => {
    const value = this.input.value;

    if (!value || value.length < 2) {
      this.items = this.items.length ? [] : this.items;
      return;
    }

    // TODO: handle min amount of items, cache?
    this.dispatchEvent(new CustomEvent('query', {detail: this.input.value}))
  });
}
