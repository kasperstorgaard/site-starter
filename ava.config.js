const concurrency = require('os').cpus().length;

module.exports = () => {
  return {
    extensions: [
			'ts',
    ],
    concurrency,
    require: [
      './ava.setup.js',
    ],
    files: [
      '**/*.spec.ts',
    ],
    ignoredByWatcher: ['!**/*.{ts,vue}'],
  };
};
