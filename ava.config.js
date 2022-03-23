module.exports = () => {
  return {
    extensions: [
			'ts',
    ],
    require: [
      './ava.setup.js',
    ],
    files: [
      '**/*.spec.ts',
    ],
    ignoredByWatcher: ['!**/*.{ts,vue}'],
  };
};
