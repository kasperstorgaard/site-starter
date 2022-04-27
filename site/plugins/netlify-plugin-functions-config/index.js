/**
 * This is a somewhat silly hack to get some build time environment variables
 * available at function runtime.
 * Netlify has this restriction from lambda that they cannot send more than
 * 4k of env variables to functions, and therefore will not take all build
 * variables with them into function execution scope, just some...
 */
const path = require('path')
const fs = require('fs')

module.exports = {
  onBuild({ netlifyConfig }) {
    const dir = netlifyConfig.functionsDirectory;
    const target = path.join(dir, '../shared/config/config.go')

    let contents = fs.readFileSync(target, 'utf8');

    const replacements = {
      '$$API_URL': process.env.DEPLOY_URL,
      '$$CONTEXT': process.env.CONTEXT
    };

    for (const key in replacements) {
      contents = contents.replaceAll(key, replacements[key])
    }

    console.log('contents: ', contents)

    fs.writeFileSync(target, contents, 'utf8');
  }
}
