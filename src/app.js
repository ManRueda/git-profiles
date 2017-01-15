const {getSystemConfig, getGlobalConfig, getLocalConfig} = require('./git-config.js')
const output = require('./output.js')
const log = console.log

function systemConfig () {
  return getSystemConfig().then(configs => {
    log(output.header('System level config:'))
    logConfigs(configs)
  }).catch(error)
}

function globalConfig () {
  return getGlobalConfig().then(configs => {
    log(output.header('Global level config:'))
    logConfigs(configs)
  }).catch(error)
}

function localConfig () {
  return getLocalConfig().then(configs => {
    log(output.header('Local level config:'))
    logConfigs(configs)
  }).catch(error)
}

function error (err) {
  log(output.err(err))
}

function logConfigs (configs) {
  let tableData = configs.map(i => [output.item(i.key), output.desc(i.value)])
  log(output.table(tableData))
}

module.exports = {
  systemConfig,
  globalConfig,
  localConfig
}
