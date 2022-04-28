import { ReactiveController, LitElement } from 'lit';

export interface LocationItem {
  id: string,
  created_at: string,
  updated_at: string,
  name: string,
}

export class LocationsListController<T extends LitElement = any> implements ReactiveController {
  private host: T | null = null;

  public data: LocationItem[] | null = null;
  public error: Error | null = null;
  public state: 'ready'|'loading'|'error'|'initial' = 'initial';

  // TODO: extract to shared api controller configs,
  constructor(host?: T | null) {
    this.host = host;
    this.host?.addController(this);
  }

  hostConnected(): void {
    // this is where we could attach some live data socket listener
  }

  async fetch() {
    this.state = 'loading';
    this.host?.requestUpdate();

    // TODO: add filtering
    try {
      const response = await fetch('/api/locations');

      if (!response.ok) {
        // TODO: implement ApiError which unwraps the endpoint error
        throw new Error("Unable to get locations")
      }

      this.data = await response.json();
      this.state = 'ready';
      return this.data;
    } catch (err) {
      this.error = err as Error;
      this.data = null;
      this.state = 'error';
      return this.data;
    } finally {
      this.host?.requestUpdate();
      console.log(this.state);
    }
  }
}
