const viteConfig = require('../vite.config.js');

module.exports = {
  stories: [
    '../src/**/*.stories.ts',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/html',
  core: {
    builder: 'storybook-builder-vite',
  },
  viteFinal(defaultConfig) {
    return {
      ...defaultConfig,
      ...viteConfig,
    };
  },
  staticDirs: ['../public'],
};
