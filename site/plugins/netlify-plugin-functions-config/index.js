const fs = require('fs')
const path = require('path')

module.exports = {
  onBuild({ netlifyConfig }) {
    const dir = netlifyConfig.functionsDirectory;

    const data = {
      apiURL: process.env.DEPLOY_URL,
      context: process.env.CONTEXT
    };

    fs.writeFileSync(path.join(dir, '../config.json'), JSON.stringify(data));
  }
}
