const exec = require('./exec.js')

function parseOutput (output) {
  return output
  .split('\n')
  .filter(l => l !== '')
  .map(l => {
    let [key, value] = l.split('=')
    return {
      key,
      value
    }
  })
}

function getSystemConfig () {
  return getConfig('system')
}

function getGlobalConfig () {
  return getConfig('global')
}

function getLocalConfig () {
  return getConfig('local')
}

function getConfig (level) {
  return exec(`git config --${level} -l`).then(stdout => {
    return parseOutput(stdout.toString())
  })
}

module.exports = {
  getSystemConfig,
  getGlobalConfig,
  getLocalConfig
}
