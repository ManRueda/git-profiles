import exec from './exec.js'

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

function setSystemConfig (key, value) {
  return setConfig(key, value, 'system')
}

function setGlobalConfig (key, value) {
  return setConfig(key, value, 'global')
}

function setLocalConfig (key, value) {
  return setConfig(key, value, 'local')
}

async function getConfig (level) {
  let stdout = await exec(`git config --${level} -l`)
  return parseOutput(stdout.toString())
}

async function setConfig (key, value, level) {
  await exec(`git config --${level} ${key} "${value.split('"').join('\\"')}"`)
}

module.exports = {
  getSystemConfig,
  getGlobalConfig,
  getLocalConfig,
  setSystemConfig,
  setGlobalConfig,
  setLocalConfig
}
