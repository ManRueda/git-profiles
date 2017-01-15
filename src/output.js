import chalk from 'chalk'
import {table} from 'table'

let tableConfig = {
  border: {
    topBody: '',
    topJoin: '',
    topLeft: '',
    topRight: '',

    bottomBody: '',
    bottomJoin: '',
    bottomLeft: '',
    bottomRight: '',

    bodyLeft: '',
    bodyRight: '',
    bodyJoin: '',

    joinBody: '',
    joinLeft: '',
    joinRight: '',
    joinJoin: ''
  },
  drawHorizontalLine: () => false,
  columns: {
    0: { paddingLeft: 3 },
    1: { paddingLeft: 3 }
  }
}

module.exports = {
  err: chalk.bold.red,
  header: chalk.bold.cyan,
  item: chalk.bold,
  bold: chalk.bold,
  success: chalk.green,
  desc: (x) => x,
  nl: () => console.log('\n'),
  table: (data) => table(data, tableConfig)
}
