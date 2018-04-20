import PackageFilesInterface from '../utils/PackageFilesInterface'
import Logger from '../utils/Logger'

const log = new Logger('init')

const DEFAULT_VERSION = '0.1.0'
const BASE_PACKAGE = {
  'version': null,
  'contracts': {},
  'stdlib': {}
}


async function init(name, version, { from, packageFileName }) {
  if (name === undefined) {
    log.error('Must provide a project name')
    return
  }

  const files = new PackageFilesInterface(packageFileName)
  const zosPackage = BASE_PACKAGE

  zosPackage.name = name
  zosPackage.version = version || DEFAULT_VERSION

  files.write(zosPackage)
}


module.exports = init


init.register = function(program, cb) {
  program
    .command('init [name] [version]')
    .description("Initializes a new zos application")
    .script(init)
}