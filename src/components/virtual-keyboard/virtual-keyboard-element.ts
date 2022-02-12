import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

const KEYS = [
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'å',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'æ', 'ø',
  'enter', 'z', 'x', 'c', 'v', 'b', 'n','m', '⌫',
];

@customElement('sg-virtual-keyboard')
export class VirtualKeyboardElement extends LitElement {
  static styles = styles();

  // The maximum number of letters allowed in a word
  @property({ type: Number, attribute: 'max-word-length' })
  maxWordLength: number = 5;

  // Letters that are in the right place
  @property({ type: String, attribute: 'guessed-letters' })
  guessedLetters = '';

  // Letters that are in use in the word, but not in the right place,
  @property({ type: String, attribute: 'used-letters' })
  usedLetters = '';

  // Letters that are not used in the word
  @property({ type: String, attribute: 'unused-letters' })
  unusedLetters = '';

  // The current word
  @property({ type: String })
  word = '';

  render() {
    return html`
    <section>
      ${KEYS.map(letter => html`
      <button
        class=${classMap({
          'is-big': letter === 'enter' || letter === '⌫',

          'is-guessed': this.guessedLetters.includes(letter),
          'is-used': this.usedLetters.includes(letter),
          'is-unused': this.unusedLetters.includes(letter),
        })}
        @click="${(event: MouseEvent) => this._letterClicked(event, letter)}"
      >${letter}</button>
      `)}
    </section>
    `;
  }

  public clear() {
    this.word = '';
  }

  private _letterClicked(event: MouseEvent, letter: string) {
    event.preventDefault();
    if (letter === 'enter') {
      this._submit();
      return;
    }

    if (letter === '⌫') {
      this._removeLetter();
      return;
    }

    this._addLetter(letter);
  }

  private _removeLetter() {
    if (!this.word.length) {
      return;
    }

    this.word = this.word.slice(0, this.word.length - 2);
    this.dispatchEvent(new CustomEvent('remove-letter', {composed: true}));
  }

  private _addLetter(letter: string) {
    if (this.word.length >= this.maxWordLength) {
      return;
    }

    this.word = this.word + letter;
    this.dispatchEvent(new CustomEvent('add-letter', {composed: true, detail: letter}));
  }

  private _submit() {
    if (this.word.length !== this.maxWordLength) {
      return;
    }

    this.dispatchEvent(new CustomEvent('submit', {composed: true, detail: this.word}));
  }
}

function styles() {
  return [css`
  section {
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    justify-items: space-between;
    gap: .5ch;
  }

  button {
    min-width: 2em;
    min-width: min(2em, 1vw);
    width: 100%;
    padding: .5em;
    padding: .5em min(.5em, .5vw);
    border-radius: .14em;

    text-transform: uppercase;
    font-size: var(--font-size-fluid-1);

    background: var(--gray-4);
    border: thin solid var(--gray-5);

    /* reset */
    outline: none;

    box-shadow: var(--shadow-2);

    /* animation related */
    transform-origin: center;
    transition: transform .2s var(--ease-3);
  }

  button:active {
    transform: scale(.95);
    box-shadow: var(--shadow-1);
  }

  button.is-big {
    grid-column: span 2;
  }

  button.is-unused {
    background: var(--gray-7);
    color: var(--gray-0);
  }

  button.is-guessed {
    background: var(--green-6);
    color: var(--gray-0);
  }

  button.is-used {
    background: var(--yellow-3);
    color: var(--gray-7);
  }
  `];
}
