import { debounce } from 'throttle-debounce';
import { css, html, LitElement } from 'lit'
import { ItemTemplate, KeyFn, repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { FormControllable } from '../../shared/mixins/form-control/form-controllable-mixin';

export interface AutocompleteItem extends Partial<Omit<Omit<HTMLOptionElement, keyof HTMLElement>, "form"|"index"|"defaultSelected">> {
  key?: string;
  value: string;
  icon?: string;
  label?: string;
  description?: string;
  highlights?: [number, number][];
  class?: string;
  style?: string;
}

/*
  AUTOCOMPLETE ELEMENT
  ====================
  inclusive take on an autocomplete, based on Adam Silver's blog post
  uses form attachInternals if available, falling back to hidden input if not.

  Sample usage:
  <form>
    <sg-autocomplete>
    </sg-autocomplete>
  </form>
*/
@customElement('sg-autocomplete')
export class AutocompleteElement extends FormControllable(LitElement) {
  static styles = [
    getStyles(),
  ];

  @query('input')
  input: HTMLInputElement;

  @query('ul')
  list: HTMLUListElement;

  @queryAll('li')
  listItems: NodeList;

  @property({ type: Number, attribute: 'minlength' })
  minlength = 2;

  @property({ type: Number })
  maxItems = 10;

  @state()
  selectedKey: any = null;

  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  focusedIndex: number = -1;

  get value() {
    return this.items.find(item => this.getKey(item) === this.selectedKey) ?? null;
  }

  @state()
  items: AutocompleteItem[] = [];

  protected getKey = (item: AutocompleteItem) => {
    return item.key ?? `${item.label ?? item.text}|${item.value}`;
  };

  protected renderItem = (item: AutocompleteItem, index: number) => {
    return html`
      <li
        data-key=${this.getKey(item)}
        value=${item.value}
        ?selected=${this.getKey(item) === this.selectedKey}
        class=${item.class ?? ''}
        style=${item.style ?? ''}
        label=${item.label ?? ''}
        aria-selected=${this.focusedIndex === index || this.getKey(item) === this.selectedKey}
        tabindex="-1"
      >
        <span >
          ${unsafeHTML(this._getItemText(item))}
        </span>
        ${when(item.description, () => html`
        <span class="description">
          ${item.description}
        </span>
        `)}
      </li>
    `;
  };

  protected renderItems = (items: AutocompleteItem[], getKey: KeyFn<AutocompleteItem>, renderItem: ItemTemplate<AutocompleteItem>) => {
    return repeat(items.slice(0, this.maxItems), getKey, renderItem);
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.tabIndex) {
      this.tabIndex = 0;
    }

    document.addEventListener('click', this._closeOnClickOutside);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._closeOnClickOutside);
  }

  updated(changes: Map<string, unknown>) {
    super.updated(changes);

    if ((
      changes.has('focusedIndex') ||
      changes.has('open') ||
      changes.has('items')
      ) && this.open) {
      const listItem = this.listItems[this.focusedIndex] as HTMLLIElement;
      listItem?.focus();
    }
  }

  render() {
    return html`
      <label for="input">
        <slot name="label">label</slot>
      </label>
      <div class="wrapper">
        <input
          id="input"
          type="text"

          autocapitalize="none"
          autocomplete="off"

          role="combobox"
          aria-owns="list"
          aria-autocomplete="list"
          aria-expanded=${this.open}

          @click=${this.show}
          @keydown=${this._inputTabHandler}
          @keyup=${this._input}
        >
        <button
          class="arrow"
          @click=${this._arrowClicked}
        >
          <slot name="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 960 560"><path d="M480 344.181 268.869 131.889c-15.756-15.859-41.3-15.859-57.054 0-15.754 15.857-15.754 41.57 0 57.431l237.632 238.937c8.395 8.451 19.562 12.254 30.553 11.698 10.993.556 22.159-3.247 30.555-11.698L748.186 189.32c15.756-15.86 15.756-41.571 0-57.431s-41.299-15.859-57.051 0L480 344.181z"/></svg>
            <span class="visually-hidden">show items</span>
          </slot>
        </button>
        <ul
          id="list"
          @keydown=${this._navigateMenu}
          @click=${this._menuItemClicked}
        >
          ${this.renderItems(this.items, this.getKey, this.renderItem)}
        </ul>
        <div aria-live="polite" role="status" class="visually-hidden">
          ${when(
            this.items.length,
            () => html`
              ${this.items.length}&nbsp;<slot name="results-available">results available</slot>
            `,
            () => html`
              <slot name="no-results">No results</slot>
            `
          )}
        </div>
      </div>
    `;
  }

  hide() {
    this.open = false;
    this.focusedIndex = -1;
    this.input.focus();
  }

  show() {
    this.open = true;
  }

  private _navigateMenu(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (!this.focusedIndex) {
          this.hide();
        } else {
          this._highlightOption(this.focusedIndex - 1);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        this._highlightOption(this.focusedIndex + 1);
        break;
      case 'Enter':
      case 'Space':
        event.preventDefault();
        this._selectOption(this.focusedIndex);
        break;
      case 'Escape':
        this.hide();
        this.input.focus();
        break;
      case 'Tab':
        this.hide();
        break;
      default:
        this.input.focus()
    }
  }

  private _inputTabHandler(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.hide();
    }
  }

  private _input(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'ArrowRight':
      case ' ':
      case 'Tab':
      case 'Enter':
      case 'Shift':
        // ignore otherwise the menu will show
        break;
      case 'ArrowDown':
        this.show();
        this._highlightOption(0);
        break;
      case 'Escape':
        this.hide();
        this.input.focus();
        break;
      default:
        this.show();
        this._query();
    }
  }

  private _highlightOption(index: number) {
    this.focusedIndex = Math.max(0, Math.min(index, this.items.length - 1));
  }

  private async _selectOption(index: number) {
    const item = this.items[index];
    this.selectedKey = this.getKey(item);
    const listItem = this.listItems[index] as HTMLLIElement;

    try {
      listItem?.classList.add('is-selecting');
      this.input.value = item.text ?? item.label;
      await this._animateCollapse();
    } finally {
      this.hide();
      this.input.focus();
      listItem?.classList.remove('is-selecting');
    }
  }

  private _arrowClicked() {
    this.show();
    this.input.focus();
  }

  private _menuItemClicked(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const items = Array.from(this.listItems);
    const index = items.findIndex(item => item === target || item.contains(target));
    this._selectOption(index);
  }

  private _getItemText(item: AutocompleteItem) {
    const text = (item.text ?? item.label ?? item.value).toString();

    let str = '';
    let pointer = 0;
    let index = 0;

    while (pointer < text.length) {
      const highlight = (item.highlights ?? [])[index];

      if (highlight) {
        // before
        str = str + text.slice(pointer, highlight[0]);
        // highlight
        str = str + `<b>${text.slice(highlight[0], highlight[1])}</b>`;
      } else {
        str = str + text.slice(pointer);
      }

      pointer = highlight ? highlight[1] : text.length;
      index = index + 1;
    }

    return str;
  }

  private _animateCollapse() {
    if (!this.list) {
      return;
    }

    const startHeight = this.list.offsetHeight ?? 0;
    const rawMaxHeight = window.getComputedStyle(this.list).maxHeight;
    const maxHeight = parseFloat(rawMaxHeight.replace(/px$/, ''));
    const endHeight = 0;

    const durationMin = 200;
    const durationMax = 400;

    const duration = Math.max(durationMin, (startHeight / maxHeight) * durationMax)

    // Start a WAAPI animation
    const animation = this.list.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [`${startHeight}px`, `${endHeight}px`],
    }, {
      delay: 100,
      duration,
      easing: 'cubic-bezier(.25, 0, .3, 1)',
    });

    return new Promise((resolve, reject) => {
      animation.onfinish = resolve;
      animation.oncancel = reject;
    });
  };

  private _query = debounce(20, () => {
    const value = this.input.value;

    if (!value || value.length < this.minlength) {
      this.items = this.items.length ? [] : this.items;
      return;
    }

    this.dispatchEvent(new CustomEvent('query', {detail: value}))
  });

  private _closeOnClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target !== this && !this.contains(target)) {
      this.hide();
    }
  }
}

function getStyles() {
  return css`
    /* util, extract? */
    .visually-hidden {
      padding: 0 !important;
      clip: rect(0 0 0 0);
      clip-path: inset(100%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    * {
      box-sizing: border-box;
    }

    /* host */
    :host {
      font-size: 1em;
      line-height: 1em;
    }

    .wrapper {
      position: relative;

      display: flex;
      flex-direction: column;
    }

    /* input */
    input {
      font-family: inherit;
      font-size: var(--font-size-1);
      padding-right: 3em;
      padding: var(--autocomplete-input-padding, .4em .55em);
    }

    .arrow {
      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      right: 0;
      height: 100%;

      padding: var(--autocomplete-input-padding, .4em .65em);
      width: 3.3em;

      background: transparent;
      outline: none;
      border: none;
    }

    .arrow svg {
      width: inherit;
    }

    /* dropdown */
    :host(:not([open])) ul {
      display: none;
    }

    li.is-selecting {
      animation: var(--animation-blink);
      animation-iteration-count: 2;
      animation-duration: .25s;
    }

    ul {
      /* reset */
      margin: 0;
      padding: 0;

      position: absolute;
      top: var(--autocomplete-dropdown-top, 100%);
      width: 100%;
      max-height: var(--autocomplete-max-height, 12em);

      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      border: var(--autocomplete-dropdown-border, var(--border-size-1) solid var(--gray-2));
      box-shadow: var(--shadow-3);
    }

    li {
      display: flex;
      flex-direction: column;

      padding: var(--autocomplete-item-padding, .4em .55em);
    }

    li span + span {
      margin-top: .25em;
      font-size: .75em;
    }

    li + li {
      border-top: var(--autocomplete-separator, var(--border-size-1) solid var(--gray-2));
    }

    li:focus,
    li:hover {
      background: var(--autocomplete-hover-bg, var(--blue-1));
      border-color: var(--autocomplete-hover-bg, var(--blue-1));
    }

    li[selected] {
      background: var(--autocomplete-selected-bg, var(--blue-2));
      border-color: var(--autocomplete-selected-bg, var(--blue-2));
    }
  `
}
