/**
 * Plugin to write environment variables for both the astro build
 * and go functions.
 * This is especially useful for netlify functions,
 * since only a subset of netlify build env variables are available
 * at function runtime.
 */
const path = require('path')
const fs = require('fs')

module.exports = {
  onPreBuild() {
    const dir = process.cwd()

    const filePath = path.join(dir, '.env')

    let contents = '';

    const variables = {
      'API_URL': process.env.DEPLOY_URL, // netlify build variable
      'CONTEXT': process.env.CONTEXT // netlify build variable
    };

    for (const key in variables) {
      contents = contents + `${key}=${variables[key]}\n`
    }

    fs.writeFileSync(filePath, contents, 'utf8');
  },
}
