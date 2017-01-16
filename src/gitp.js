#! /usr/bin/env node
import { err, header, item, success, bold, table, desc } from './output.js'
import { createProfile, getProfile, listProfiles, removeProfile, setConfig, getConfig } from './profiles.js'
import { getSystemConfig, getGlobalConfig, getLocalConfig, setSystemConfig, setGlobalConfig, setLocalConfig } from './git-config.js'
import inquirer from 'inquirer'

async function main () {
  let operation = await askOperation()
  if (operation === 'See my current profile and configuration') {
    let levels = await askOperationLevel()
    let config = await getConfig()

    let currentConfig = {
      system: await getSystemConfig(),
      global: await getGlobalConfig(),
      local: await getLocalConfig()
    }
    if (config.current) {
      let profile = await getProfile(config.current)
      config.current = JSON.stringify(currentConfig) === JSON.stringify(profile) ? config.current : null
    }

    console.log('\n')
    console.log('\n')
    console.log(header(`Current profile: ${config.current || '<not set>'}`))
    console.log('\n')

    if (levels.includes('System')) {
      console.log(header('System level config:'))
      logConfigs(currentConfig.system)
    }
    if (levels.includes('Global')) {
      console.log(header('Global level config:'))
      logConfigs(currentConfig.global)
    }
    if (levels.includes('Local')) {
      console.log(header('Local level config:'))
      logConfigs(currentConfig.local)
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
    let profile = await getProfile(selected)

    for (let {key, value} of profile.system) {
      await setSystemConfig(key, value)
    }

    for (let {key, value} of profile.global) {
      await setGlobalConfig(key, value)
    }

    for (let {key, value} of profile.local) {
      await setLocalConfig(key, value)
    }

    let config = await getConfig()
    config.current = selected
    await setConfig(config)

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
