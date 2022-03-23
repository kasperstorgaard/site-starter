const { register } = require('ts-node');

register({
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'node',
  },
});
