import {adoptStyles, ReactiveController, ReactiveElement} from 'lit';
import { OverlayElement } from '../../components/overlay/overlay-element';

let idx = 0;

export class OverlayController implements ReactiveController {

  _container: Element;
  _host: ReactiveElement;
  _hostConstructor: typeof ReactiveElement;

  renderRoot: ShadowRoot;
  isOpen = false;

  // The element singleton that all overlay controller users add themselves to
  _element: OverlayElement;
  get element() {
    // get the existing element, if present
    // TODO: store locally or on constructor?
    if (!this._element) {
      this._element = document.querySelector('body > sg-overlay');
    }

    // if there is no existing element, create a new one
    if (!this._element) {
      this._element = new OverlayElement();
      document.body.appendChild(this._element);
    }

    return this._element;
  }

  constructor(host: ReactiveElement, hostConstructor: typeof ReactiveElement) {
    this._host = host;
    this._host.addController(this);
    this._hostConstructor = hostConstructor;
    this._container = document.createElement('div');
    this._container.setAttribute('id', `overlay__${idx++}`);

    this.renderRoot = this._container.attachShadow({ mode: 'open' });

    if (this._hostConstructor.elementStyles) {
      adoptStyles(this.renderRoot, this._hostConstructor.elementStyles);
    }

    this._host.style.display = 'none';
  }

  // The first time a host is connected, add the main overlay element.
  hostConnected() {
    this.open();
  }

  // TODO: move to teleport and rename "attach" or similar
  open() {
    this.element.appendChild(this._container);
    for (const child of this._host.children) {
      this._container.appendChild(child);
    }
  }

  // TODO: move to teleport and rename "detach" or similar
  close() {
    for (const child of this._host.children) {
      this._container.appendChild(child);
    }
    this.element.removeChild(this._container);
  }
}
