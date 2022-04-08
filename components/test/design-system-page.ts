import { Page } from '@playwright/test';

export class DesignSystemPage {
  readonly page: Page;
  readonly baseURL: string;
  readonly basePath = 'design-system';

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto(type: 'atom'|'molecule'|'organism', name: string, variant?: string) {
    const location = new URL(this.baseURL);
    location.pathname = '/iframe.html';

    const idPath = variant ?
      `${this.basePath}-${type}s-${name}--${variant}` :
      `${this.basePath}-${type}s-${name}`;

    location.searchParams.set('id', idPath);
    location.searchParams.set('viewMode', 'story');

    await this.page.goto(location.href);

    return this.page;
  }
}
