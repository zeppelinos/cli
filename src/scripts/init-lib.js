import LocalLibController from  '../models/local/LocalLibController'

export default async function initLib({ name, version, force = false, packageFile = undefined }) {
  if (name === undefined) throw Error('A project name must be provided to initialize the project.')
  
  const libController = new LocalLibController(packageFile)
  libController.init(name, version, force)
  libController.writePackage()
}
