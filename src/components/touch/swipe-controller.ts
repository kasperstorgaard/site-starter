import { ReactiveController } from '@lit/reactive-element';
import { LitElement } from 'lit';

type Handler = (velocity: number) => void;

export type SwipeDirection = 'up'|'down'|'left'|'right';

export class SwipeController implements ReactiveController {
  private _x: number | null = null;
  private _y: number | null = null;

  host: LitElement;
  threshold = 2;
  direction: SwipeDirection|null = null;
  onUp: Handler = () => {};
  onDown: Handler = () => {};
  onLeft: Handler = () => {};
  onRight: Handler = () => {};

  constructor(host: LitElement, options: {
    threshold?: number;
    onUp?: Handler,
    onDown?: Handler,
    onLeft?: Handler,
    onRight?: Handler,
  }) {
    this.host = host;
    host.addController(this);

    this.threshold = options?.threshold ?? this.threshold;
    this.onUp = options?.onUp ?? this.onUp;
    this.onDown = options?.onDown ?? this.onDown;
    this.onLeft = options?.onLeft ?? this.onLeft;
    this.onRight = options?.onRight ?? this.onRight;
  }

  hostConnected(): void {
    this.host.addEventListener('touchstart', this._onTouchStart);
    this.host.addEventListener('touchmove', this._onTouchMove);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('touchstart', this._onTouchStart);
    this.host.removeEventListener('touchmove', this._onTouchMove);
  }

  private _onTouchStart = (event: TouchEvent) => {
    this._x = event.touches[0].clientX;
    this._y = event.touches[0].clientY;
  };

  private _onTouchMove = (event: TouchEvent) => {
    if (!this._x  ||  !this._y) {
      return;
    }

    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;
    const xDiff = this._x - x;
    const yDiff = this._y - y;

    const velocity = Math.max(Math.abs(xDiff), Math.abs(yDiff));
    if (velocity <= this.threshold) {
      this._x = null;
      this._y = null;
      return;
    }

    // horizontal
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        this.onLeft(velocity);
      } else {
        this.onRight(velocity);
      }
    // vertical
    } else {
      if (yDiff > 0) {
        this.onUp(velocity);
      } else {
        this.onDown(velocity);
      }
    }

    // Reset values.
    this._x = null;
    this._y = null;
  };
}
