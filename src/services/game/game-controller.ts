import { LitElement, ReactiveController, ReactiveElement } from 'lit';

export interface Guess {
  letters: {
    value: string,
    state: 'used'|'guessed'|'unused'|null,
  }[]
}

// @ts-expect-error
export class GameController<T extends LitElement> implements ReactiveController {
  private _host: LitElement;

  maxWordLength: number = 5;
  maxGuesses: number = 6;

  guesses: Guess[] = [];

  get currentGuess(): Guess | null {
    return this.guesses.length ? this.guesses[this.guesses.length - 1] : null;
  }

  constructor(host: T, config?: {
    maxWordLetters?: number,
    maxGuesses?: number,
  }) {
    this._host = host;
    this.maxWordLength = config.maxWordLetters ?? this.maxWordLength;
    this.maxGuesses = config.maxGuesses ?? this.maxGuesses;
  }

  guess(word: string) {
    // this._host.requestUpdate();
  }
}
