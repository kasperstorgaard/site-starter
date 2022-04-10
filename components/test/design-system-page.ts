import { Page } from '@playwright/test';

export class DesignSystemPage {
  readonly page: Page;
  readonly basePath = 'design-system';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(type: 'atom'|'molecule'|'organism', name: string, variant?: string) {
    const basePath = '/iframe.html';

    const idPath = variant ?
      `${this.basePath}-${type}s-${name}--${variant}` :
      `${this.basePath}-${type}s-${name}`;

    await this.page.goto(`${basePath}?id=${idPath}&viewMode=story`);

    return this.page;
  }
}
