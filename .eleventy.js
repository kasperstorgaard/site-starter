// .eleventy.js
const esbuild = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');
const svgSprite = require('eleventy-plugin-svg-sprite');

// env setup
const isProd = process.env.ELEVENTY_ENV === 'production';
const isWatchMode = process.argv.includes('--serve');

module.exports = config => {
  //--- Plugins

  // creates an svg sprite of all svgs in directory
  config.addPlugin(svgSprite, {
    path: './src/assets/icons',
  });

  // Set up esbuild for scripts and styles
  let assetBuilder = null;

  const setupAssetBuilder = () => {
    return esbuild.build({
      bundle: true,
      entryPoints: [
        './src/main.scss',
        './src/main.ts'
      ],
      outdir: '_site/assets',
      minify: isProd,
      sourcemap: !isProd,
      // only go for incremental builds in watch mode
      incremental: isWatchMode,
      plugins: [
        sassPlugin(),
      ],
    });
  }

  config.on('afterBuild', async () => {
    if (!assetBuilder) {
      assetBuilder = await setupAssetBuilder();
    } else {
      await assetBuilder.rebuild();
    }
  });

  // Add watch targets, so we keep this within 11ty setup,
  // instead of running parallel tasks.
  config.addWatchTarget('./src/**/*.ts');
  config.addWatchTarget('./src/**/*.scss');
};
