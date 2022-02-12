import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './_private/guess-grid-row-element';
import { Guess } from './_private/guess-grid-row-element';

@customElement('sg-guess-grid')
export class GuessGridElement extends LitElement {
  static styles = styles();

  @property({ type: Number, attribute: 'max-guesses' })
  maxGuesses = 6;

  // The maximum number of letters allowed in a word
  @property({ type: Array })
  guesses: Guess[] = [];

  render() {
    console.log('render');
    const rows = (new Array(this.maxGuesses))
      .fill(0)
      .map((_, index) => this.guesses[index]);

    return html`
    ${rows.map(guess => html`
      <sg-guess-grid-row .guess="${guess}"></sg-guess-grid-row>
    `)}
    `;
  }
}

function styles() {
  return [css`
  :host {
    display: grid;
    width: 100%;
    gap: .5ch;
  }
  `];
}
