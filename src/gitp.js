#! /usr/bin/env node
import { err, header, item, success, bold, table, desc } from './output.js'
import { createProfile, getProfile, listProfiles, removeProfile } from './profiles.js'
import { getSystemConfig, getGlobalConfig, getLocalConfig, setSystemConfig, setGlobalConfig, setLocalConfig } from './git-config.js'
import inquirer from 'inquirer'

async function main () {
  let operation = await askOperation()
  console.log(operation)
  if (operation === 'See my current profile and configuration') {
    let levels = await askOperationLevel()
    if (levels.includes('System')) {
      let configs = await getSystemConfig()
      console.log(header('System level config:'))
      logConfigs(configs)
    }
    if (levels.includes('Global')) {
      let configs = await getGlobalConfig()
      console.log(header('Global level config:'))
      logConfigs(configs)
    }
    if (levels.includes('Local')) {
      let configs = await getLocalConfig()
      console.log(header('Local level config:'))
      logConfigs(configs)
    }
  }

  if (operation === 'Save profile') {
    let name = await askInput('Enter profile name:')
    let levels = await askOperationLevel()
    let systemConf = levels.includes('System') ? await getSystemConfig() : []
    let globalConf = levels.includes('Global') ? await getGlobalConfig() : []
    let localConf = levels.includes('Local') ? await getLocalConfig() : []

    await createProfile(name, {
      system: systemConf,
      global: globalConf,
      local: localConf
    })
    console.log(success(`Profile ${bold(name)} saved`))
  }

  if (operation === 'Load profile') {
    let profiles = await listProfiles()
    let selected = await askProfile(profiles)
    let config = await getProfile(selected)

    for (let {key, value} of config.system) {
      await setSystemConfig(key, value)
    }

    for (let {key, value} of config.global) {
      await setGlobalConfig(key, value)
    }

    for (let {key, value} of config.local) {
      await setLocalConfig(key, value)
    }

    console.log(success(`Profile ${bold(selected)} loaded`))
  }

  if (operation === 'Remove profile') {
    let profiles = await listProfiles()
    let selected = await askProfile(profiles)
    await removeProfile(selected)

    console.log(success(`Profile ${bold(selected)} removed`))
  }

  if (operation === 'List profiles') {
    let profiles = await listProfiles()
    console.log(header('Profiles:'))
    profiles.forEach(p => console.log(item(`  * ${p}`)))
  }
}

async function mainCatched () {
  try {
    await main()
  } catch (e) {
    console.log(err(e.message || e))
  }
}

mainCatched()

function logConfigs (configs) {
  let tableData = configs.map(i => [item(i.key), desc(i.value)])
  console.log(table(tableData))
}

function askOperation () {
  return askChoices('What do you need:', [
    'See my current profile and configuration',
    'Load profile',
    'List profiles',
    'Save profile',
    'Remove profile'
  ])
}

function askProfile (profiles) {
  return askChoices('Select profile:', profiles)
}

function askChoices (message, choices) {
  return inquirer.prompt([{
    type: 'list',
    name: 'item',
    message,
    choices
  }]).then(a => a.item)
}

function askOperationLevel () {
  return inquirer.prompt([{
    type: 'checkbox',
    name: 'levels',
    message: 'In which levels do you want to work:',
    choices: [
      'System',
      'Global',
      'Local'
    ]
  }]).then(a => a.levels)
}

function askInput (label) {
  return inquirer.prompt([{
    type: 'input',
    name: 'input',
    message: label
  }]).then(a => a.input)
}
