import { css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SwipeController, SwipeDirection } from '../touch/swipe-controller';

type SwipePayload = {
  direction: SwipeDirection,
  velocity: number,
}

export type SwipeEvent = CustomEvent<SwipePayload>;

@customElement('sg-puck')
export class PuckElement extends LitElement {
  static styles = styles();

  touch = new SwipeController(this, {
    threshold: 5,
    onUp: this._createEventDispatcher('up'),
    onDown: this._createEventDispatcher('down'),
    onLeft: this._createEventDispatcher('left'),
    onRight: this._createEventDispatcher('right'),
  });

  private _createEventDispatcher(direction: SwipeDirection) {
    return (velocity: number) => this.dispatchEvent(new CustomEvent<SwipePayload>('swipe', {
      detail: { direction, velocity }
    }));
  }
}

function styles() {
  return [css`
    :host {
      box-sizing: border-box;
      border-radius: 50%;
    }
  `];
}
