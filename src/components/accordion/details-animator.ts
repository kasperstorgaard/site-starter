/*
  Helper class that wraps a details+summary element and adds animation to it.
  loosely based on:
  https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
*/
export class DetailsAnimator {
  private _isClosing = false;
  private _isExpanding = false;
  private _animation: Animation | null = null;
  private _el: HTMLElement;
  private _animationEasing = 'ease-out';
  // animation duration and easing defaults,
  private _animationDuration = 500;

  get isOpen() {
    return this._el.hasAttribute('open');
  }
  set isOpen(value: boolean) {
    if (value) {
      this._el.setAttribute('open', '');
    } else {
      this._el.removeAttribute('open');
    }
  }

  private get _summaryEl() {
    return this._el?.querySelector('summary') ?? null;
  }
  private get _contentEl() {
    for (const el of this._el.children) {
      if (el instanceof HTMLElement && el !== this._summaryEl) {
        return el;
      }
    }
  }

  constructor(el: HTMLElement, options: {
    easing: string,
    duration: number, // in milliseconds
  }) {
    this._el = el;
    this._animationEasing = options.easing;
    this._animationDuration = options.duration;
  }

  /**
   * Opens the details element through animation.
   */
  open() {
    if (this.isOpen) {
      return;
    }

    this._el.style.height = `${this._el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.isOpen = true;
    this._el.dispatchEvent(new CustomEvent('open'));

    // Wait for the next frame to call the expand animation
    window.requestAnimationFrame(() => this._animateExpand());
  };

  /**
   * Closes the details element through animation.
   */
  close() {
    if (!this.isOpen) {
      return;
    }

    this._animateCollapse();
  }

  /**
   * Opens if closed and vice versa.
   */
  toggle() {
    // Check if the element is being closed or is already closed
    if (this._isClosing || !this.isOpen) {
      this.open();
    // Check if the element is being openned or is already open
    } else if (this._isExpanding || this.isOpen) {
      this.close();
    }
  };

  private _finalizeAnimation(value: boolean) {
    // Set the details[open] value to reflect the final state.
    this.isOpen = value;

    if (value) {
      this._el.dispatchEvent(new CustomEvent('open'));
    }

    // Clear the stored animation
    this._animation = null;

    // Reset isClosing & isExpanding
    this._isClosing = false;
    this._isExpanding = false;

    // Remove the overflow hidden and the fixed height
    this._el.style.height = '';
    this._el.style.overflow = '';
  }

  // Expand animation
  private _animateExpand() {
    if (!this._el) {
      return;
    }

    // Add an overflow on the <details> to avoid content overflowing
    this._el.style.overflow = 'hidden';

    // Set the element state as "expanding"
    this._isExpanding = true;

    const startHeight = this._el.offsetHeight;
    const endHeight = this._summaryEl.offsetHeight + (this._contentEl?.offsetHeight ?? 0);

    // If there is already an animation running, cancel it
    this._animation?.cancel();

    // Start a WAAPI animation
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
    this._animation = this._el.animate({
      // Set the start and end keyframes of the animation
      height: [`${startHeight}px`, `${endHeight}px`],
    }, {
      duration: this._animationDuration,
      easing: this._animationEasing,
    });

    // When the animation is complete, call onAnimationFinish()
    this._animation.onfinish = () => this._finalizeAnimation(true);

    // If the animation is cancelled, reset the state
    this._animation.oncancel = () => this._isExpanding = false;
  };

  private _animateCollapse() {
    if (!this._el) {
      return;
    }

    // Add an overflow on the <details> to avoid content overflowing
    this._el.style.overflow = 'hidden';

    const startHeight = this._el.offsetHeight ?? 0;
    const endHeight = this._summaryEl.offsetHeight ?? 0;

    // If there is already an animation running, cancel it
    this._animation?.cancel();

    // Start a WAAPI animation
    this._animation = this._el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [`${startHeight}px`, `${endHeight}px`],
    }, {
      duration: this._animationDuration,
      easing: this._animationEasing,
    });

    // When the animation is complete, call onAnimationFinish()
    this._animation.onfinish = () => this._finalizeAnimation(false);

    // If the animation is cancelled, isClosing variable is set to false
    this._animation.oncancel = () => this._isClosing = false;
  };
}
