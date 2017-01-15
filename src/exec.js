const exec = require('child_process').exec

module.exports = (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err || stderr.toString() !== '') {
        return reject(err || stderr.toString())
      }
      resolve(stdout)
    })
  })
}
