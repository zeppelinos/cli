import { Logger } from 'zos-lib'
import createProxy from '../../scripts/create-proxy'
import runWithTruffle from '../../utils/runWithTruffle'

const log = new Logger('CreateProxy')

module.exports = function(program) {
  program
    .command('create-proxy <alias>')
    .usage('<alias> --network <network> [options]')
    .description(`Deploy a new proxy to make your contract upgradeable.
      Provide the <alias> name you used to register your contract.`)
    .option('-i, --init [function]', "Tell whether your contract has to be initialized or not. You can provide name of the initialization function. If none is given, 'initialize' will be considered by default")
    .option('-a, --args <arg1, arg2, ...>', 'Provide initialization arguments for your contract if required')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('-n, --network <network>', 'Provide a network to be used')
    .option('--force', 'Force creation of the proxy even if contracts have local modifications')
    .action(function (contractAlias, options) {
      let initMethod = options.init
      if(typeof initMethod === 'boolean') initMethod = 'initialize'

      let initArgs = options.args
      if(typeof initArgs === 'string') initArgs = initArgs.split(",")
      else if(typeof initArgs === 'boolean' || initMethod) initArgs = []

      const { from, network, force } = options

      if (network === undefined) {
        log.error('Must provide a network name')
        return
      }

      runWithTruffle(async () => await createProxy({ contractAlias, network, from, initMethod, initArgs, force }), network)
    })
}
