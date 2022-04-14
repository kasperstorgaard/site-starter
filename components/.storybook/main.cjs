const viteConfig = require('../vite.config.cjs');

module.exports = {
  stories: [
    '../src/**/*.stories.ts',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: '@storybook/html',
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal(defaultConfig) {
    return {
      ...defaultConfig,
      ...viteConfig,
    };
  },
  staticDirs: ['../public'],
};
