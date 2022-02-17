import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { GameController, Piece } from '../../services/game/game-controller';
import './puck-element';
import { SwipeEvent } from './puck-element';
import { animate } from '@lit-labs/motion';

@customElement('sg-board')
export class BoardElement extends LitElement {
  static styles = styles();

  private _animationDuration: number = 333;

  game: GameController<BoardElement> = new GameController(this);

  render() {
    return html`
      ${map(range(this.game.board.rows), y =>
        map(range(this.game.board.columns), x =>
          html`<div
            class="space"
            style=${styleMap({
              '--row': (y + 1).toString(),
              '--column': (x + 1).toString(),
            })}
          ></div>`
        )
      )}
      ${map(this.game.pieces, piece => {
        if (piece.type === 'puck') {
          return html`
          <sg-puck
            style=${styleMap({
              '--row': (piece.position.y + 1).toString(),
              '--column': (piece.position.x + 1).toString(),
            })}
            class="${piece.color}"
            @swipe=${(event: SwipeEvent) => this._onSwipe(event, piece)}
            ${animate({ keyframeOptions: { duration: this._animationDuration }})}
          ></sg-puck>
          `;
        }

        if (piece.type === 'block') {
          return html`
          <div
            style=${styleMap({
              '--row': (piece.position.y + 1).toString(),
              '--column': (piece.position.x + 1).toString(),
            })}
            class="block"
          ></div>
          `;
        }

        return nothing;
      })}
    `;
  }

  firstUpdated(changes: PropertyValues) {
    super.firstUpdated(changes);
    this.style.setProperty('--rows', this.game.board.rows.toString());
    this.style.setProperty('--columns', this.game.board.columns.toString());
  }

  _onSwipe(event: SwipeEvent, piece: Piece) {
    this._animationDuration = this._getAnimationDuration(event.detail.velocity);
    this.game.move(piece, event.detail.direction);
  }

  _getAnimationDuration(velocity: number) {
    const distance = this.game.lastMove?.distance ?? 1;
    const maxDistance = Math.max(this.game.board.columns, this.game.board.rows);

    const maxDuration = 850;
    const minDuration = 50;

    const baseVelocity = 15;
    const velocityFactor = Math.pow(baseVelocity / velocity, 2);
    console.log({ velocityFactor });

    return Math.max(
      minDuration,
      Math.min(
        (distance / maxDistance) * maxDuration * velocityFactor,
        maxDuration
      )
    );
  }
}

function styles() {
  return [css`
    :host {
      --space-size: 2em;

      display: grid;
      grid-template-rows: repeat(var(--rows), var(--space-size));
      grid-template-columns: repeat(var(--columns), var(--space-size));
      justify-items: center;
      align-items: center;

      border: thin solid var(--gray-9);
    }

    sg-puck {
      grid-row-start: var(--row);
      grid-row-end: span 1;
      grid-column-start: var(--column);
      grid-column-end: span 1;

      width: 80%;
      height: 80%;
    }

    .pink {
      background: var(--pink-5);
    }

    .yellow {
      background: var(--yellow-5);
    }

    .block {
      box-sizing: border-box;

      grid-row-start: var(--row);
      grid-row-end: span 1;
      grid-column-start: var(--column);
      grid-column-end: span 1;
      background: black;
      width: 100%;
      height: 100%;
    }

    .space {
      box-sizing: border-box;

      grid-row-start: var(--row);
      grid-row-end: span 1;
      grid-column-start: var(--column);
      grid-column-end: span 1;

      width: 100%;
      height: 100%;

      border: 1px solid var(--gray-2);
    }
  `];
}
