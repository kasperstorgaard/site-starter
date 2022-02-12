import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export interface Guess {
  letters: {
    value: string,
    state: 'used'|'guessed'|'unused'|null,
  }[]
}

@customElement('sg-guess-grid-row')
export class GuessGridRowElement extends LitElement {
  static styles = styles();

  // The maximum number of letters allowed in a word
  @property({ type: Object })
  guess: Guess | null = null;

  @property({ type: Number, attribute: 'max-letters' })
  maxLetters = 5;

  render() {
    const letters = (new Array(this.maxLetters))
      .fill(0)
      .map((_, index) => this.guess?.letters[index] ?? { state: '', value: '' });

    return html`
      ${letters.map(letter => html`
        <span class="${classMap({
          'is-unused': letter.state === 'unused',
          'is-used': letter.state === 'used',
          'is-guessed': letter.state === 'guessed',
        })}">
          ${ letter.value }
        </span>
      `)}
    `;
  }

  updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('maxLetters')) {
      this.style.setProperty('--guess-grid-row-letters', this.maxLetters.toString());
    }
  }
}

function styles() {
  return [css`
  :host {
    display: grid;
    grid-template-columns: repeat(var(--guess-grid-row-letters), 1fr);
    gap: .5ch;
  }

  span {
    display: grid;
    justify-content: center;
    align-content: center;

    padding: .5em;
    min-width: 1ch;
    min-height: 1ch;
    aspect-ratio: 1/1;

    font-size: var(--font-size-fluid-2);
    font-weight: 650;
    text-transform: uppercase;

    border: thin solid var(--gray-8);
  }

  span.is-unused {
    background: var(--gray-6);
    color: var(--gray-1);
  }

  span.is-used {
    background: var(--yellow-3);
  }

  span.is-guessed {
    background: var(--green-3);
  }
  `];
}
