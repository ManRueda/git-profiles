import path from 'path'
import { ensureFolder, ensureFile, createFile, readJsonFile, exists, listDirectory, removeFile } from './fs-ext.js'
const homePath = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const appDir = path.resolve(homePath, '.git-profiles')
const configFile = path.resolve(appDir, 'config.json')

async function createProfile (name, config) {
  let profileFile = path.resolve(appDir, `${name}.json`)
  await ensureFolder(appDir)
  await ensureFile(profileFile)

  let bufferToSave = Buffer.from(JSON.stringify(config))

  await createFile(profileFile, bufferToSave)
}

async function getProfile (name) {
  let profileFile = path.resolve(appDir, `${name}.json`)
  if (!await exists(profileFile)) {
    throw new Error(`The profile ${name} does not exist`)
  } else {
    return await readJsonFile(profileFile)
  }
}

async function listProfiles () {
  await ensureFolder(appDir)
  let profiles = await listDirectory(appDir)
  return profiles.filter(f => f !== '.' && f !== '..' && f !== 'config.json')
    .map(f => path.basename(f, path.extname(f)))
}

async function removeProfile (name) {
  let profileFile = path.resolve(appDir, `${name}.json`)
  await removeFile(profileFile)
}

async function getConfig () {
  await ensureFolder(appDir)
  await ensureFile(configFile)
  return await readJsonFile(configFile)
}

async function setConfig (config) {
  await ensureFolder(appDir)
  let bufferToSave = Buffer.from(JSON.stringify(config))

  await createFile(configFile, bufferToSave)
}

module.exports = {
  createProfile,
  getProfile,
  listProfiles,
  getConfig,
  setConfig,
  removeProfile
}
