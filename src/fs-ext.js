import fs from 'fs'
import path from 'path'

function createFile (dir, content) {
  let fullDir = path.resolve(dir)
  return new Promise((resolve, reject) => {
    fs.writeFile(fullDir, content, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

function removeFile(dir) {
  let fullDir = path.resolve(dir)
  return new Promise((resolve, reject) => {
    fs.unlink(fullDir, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

function readJsonFile (dir) {
  let fullDir = path.resolve(dir)
  return new Promise((resolve, reject) => {
    fs.readFile(fullDir, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })
}

function createFolder (dir) {
  let fullDir = path.resolve(dir)
  return new Promise((resolve, reject) => {
    fs.mkdir(fullDir, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function listDirectory (dir) {
  let fullDir = path.resolve(dir)
  return new Promise((resolve, reject) => {
    fs.readdir(fullDir, (err, files) => {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  })
}

function stat (dir) {
  let fullDir = path.resolve(dir)
  return new Promise((resolve, reject) => {
    fs.stat(fullDir, (err, stat) => {
      if (err) {
        return reject(err)
      }
      resolve(stat)
    })
  })
}

function exists (dir) {
  return ensure(dir).then(x => !x)
}

function ensure (dir) {
  let fullDir = path.resolve(dir)
  return new Promise((resolve, reject) => {
    fs.stat(fullDir, (err, stat) => {
      if (err && err.code !== 'ENOENT') {
        return reject(err)
      }
      if (err && err.code === 'ENOENT') {
        return resolve(true)
      }
      return resolve(false)
    })
  })
}

function ensureFolder (dir) {
  return ensure(dir).then(needCreation => {
    if (needCreation) {
      return createFolder(dir)
    }
  }).then(() => stat(dir))
}

function ensureFile (dir) {
  return ensure(dir).then(needCreation => {
    if (needCreation) {
      return createFile(dir, '')
    }
  }).then(() => stat(dir))
}

module.exports = {
  ensureFolder,
  ensureFile,
  createFile,
  readJsonFile,
  exists,
  listDirectory,
  removeFile
}
