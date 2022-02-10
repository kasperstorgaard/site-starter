import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { DetailsAnimator } from './details-animator';

/*
  ACCORDION ELEMENT
  =================
  Progressive enhance based take on an accordion,
  using the native details + summary elements for a11y, SEO,
  but with a WAAPI based animation on top.
  This brings no styling, except for a few styles to control the animation,
  so please bring you own component based styles for custom icon, paddings etc.

  Sample usage:
  <sg-accordion>
    <details>
      <summary>Item 1</summary>
      This is some content
    </details>
    <details open>
      <summary>Item 2</summary>
      This is some other content
    </details>
  </sg-accordion>
*/
@customElement('sg-accordion')
export class AccordionElement extends LitElement {
  static styles = [
    css`
      :host {
        --accordion-animation-duration: 500ms;
        --accordion-animation-easing: var(--ease-2);
      }
    `
  ]
  /**
   * Map of animators connected to elements, so we can get the animator
   * instance when needed.
   * The usage of weakmap means the animators are cleaned up when the element is removed.
   * (if we properly remove all element listeners)
   */
  private _animators = new WeakMap<HTMLElement, DetailsAnimator>()

  @query('slot')
  private _slot: HTMLSlotElement

  /**
   * List of the details elements in the default slot.
   */
  @queryAssignedElements({ selector: 'details' })
  items: HTMLElement[];

  /**
   * If multiple items are allowed to be open or not
   */
  @property({ type: Boolean, attribute: 'single-open' })
  singleOpen = false;

  firstUpdated(changes: PropertyValues): void {
    super.firstUpdated(changes);

    const computedStyle = window.getComputedStyle(this);
    const easing = computedStyle.getPropertyValue('--accordion-animation-easing');
    const durationRaw = computedStyle.getPropertyValue('--accordion-animation-duration');
    const duration = getDurationMs(durationRaw);

    // We need to watch for slot changes in order to perform any "items"
    // related tasks, as it is only a getter.
    this._slot.addEventListener('slotchange', () => {
      for (const element of this.items) {
        // make sure we only set up an element once.
        if (!this._animators.has(element)) {
          this._setupElement(element, { easing, duration });
        }
      }
    });
  }

  render() {
    return html`<slot></slot>`;
  }

  /**
   * The open handler takes care of any cross cutting logic.
   */
  private _onElementOpen(target: HTMLElement) {
    if (!this.singleOpen) {
      return;
    }

    for (const element of this.items) {
      if (element === target) {
        continue;
      }

      this._animators.get(element)?.close();
    }
  }

  /**
   * Creates and saves the animator, and sets up all event handlers.
   */
  private _setupElement(element: HTMLElement, options: {
    easing: string,
    duration: number,
  }) {
    const animator = new DetailsAnimator(element, options);
    this._animators.set(element, animator);

    // Listen for the custom "open" event, so we can handle any
    // cross element interaction (eg. closing other elements if multi=false)
    element.addEventListener('open', () => this._onElementOpen(element));

    // This is the default click handling for an accordion item,
    // which also takes care of keyboard navigation,
    // since you can TAB to the details element and then open using space.
    element.addEventListener('click', (event: Event) => {
      // Stop default behaviour from the browser, which lets us take control,
      // so we can start animation, and set open state when done.
      event.preventDefault();
      animator.toggle();
    });
  }
}

function getDurationMs(rawValue: string): number | null {
  const value = parseFloat(rawValue);
  if (isNaN(value)) {
    return null;
  }

  const usesSeconds = /\d\s?s\s*$/.test(rawValue);
  if (usesSeconds) {
    return value * 1000;
  }

  return value;
}

