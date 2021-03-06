import { Page } from '@playwright/test';

export class DesignSystemPage {
  readonly page: Page;
  readonly basePath = 'design-system';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(type: 'atom'|'molecule'|'organism', name: string, variant?: string) {
    if (this.page.isClosed()) {
      return;
    }

    try {
      await this._blockNetlifyScripts();

      const basePath = '/iframe.html';

      const idPath = variant ?
        `${this.basePath}-${type}s-${name}--${variant}` :
        `${this.basePath}-${type}s-${name}`;

      await this.page.goto(`${basePath}?id=${idPath}&viewMode=story`);
      await this.page.locator('#root > div').waitFor();

      return this.page;
    } catch (err) {
      if (this.page.isClosed()) {
        return;
      }

      throw err;
    }
  }

  /**
   * Captures a screenshot of the design system page.
   */
  capture() {
    return this.page.locator('#root').screenshot({
      animations: 'disabled',
      scale: 'css'
    });
  }

  private async _blockNetlifyScripts() {
    // blocks any netlify tooling, so they don't interfere with tests.
    await this.page.route('**/netlify.js', route => !this.page.isClosed() ?
      route.abort('blockedbyclient') :
      null
    );
  }
}
