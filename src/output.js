const chalk = require('chalk')
const {table} = require('table')

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
  desc: (x) => x,
  nl: () => console.log('\n'),
  table: (data) => table(data, tableConfig)
}
