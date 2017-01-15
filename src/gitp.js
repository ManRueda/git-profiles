#! /usr/bin/env node
const { systemConfig, globalConfig, localConfig } = require('./../src/app.js')
const inquirer = require('inquirer')

async function main () {
  let operation = await askOperation()
  console.log(operation)
  if (operation === 'Show me my current configuration') {
    let levels = await askOperationLevel()
    if (levels.includes('System')) {
      await systemConfig()
    }
    if (levels.includes('Global')) {
      await globalConfig()
    }
    if (levels.includes('Local')) {
      await localConfig()
    }
  }
}

main()
/*
inquirer.prompt([askOperation(), askOperationLevel()]).then(answers => {
  if (answers.operation === 'Show me my current configuration') {
    askOperationLevel().then()
    if (answers.levels.includes('System')) {
      app.systemConfig()
    }
    if (answers.levels.includes('Global')) {
      app.globalConfig()
    }
    if (answers.levels.includes('Local')) {
      app.localConfig()
    }
  }
  return answers
}).then(answers => {
  console.log(answers)
})
*/
function askOperation () {
  return inquirer.prompt([{
    type: 'list',
    name: 'operation',
    message: 'What do you need:',
    choices: [
      'Show me my current configuration',
      'Update key of my configuration',
      'Remove key of my configuration',
      'Save profile',
      'Create new profile'
    ]
  }]).then(a => a.operation)
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
