'use strict';

import upgrade from '../scripts/upgrade'
import runWithTruffle from '../utils/runWithTruffle'
import { parseInit } from '../utils/input'

const name = 'update'
const signature = `${name} [alias] [address]`
const description = 'upgrade contract to a new logic. Provide the [alias] you added your contract with, or use --all flag to upgrade all. If no [address] is provided, all instances of that contract class will be upgraded'

const register = program => program
  .command(signature, { noHelp: true })
  .usage('[alias] [address] --network <network> [options]')
  .description(description)
  .option('--init [function]', `call function after upgrading contract. If no name is given, 'initialize' will be used`)
  .option('--args <arg1, arg2, ...>', 'provide initialization arguments for your contract if required')
  .option('--all', 'upgrade all contracts in the application')
  .option('--force', 'force creation even if contracts have local modifications')
  .withNetworkOptions()
  .action(action)

async function action(contractAlias, proxyAddress, options) {
  const { initMethod, initArgs } = parseInit(options, 'initialize')
  const { all, force } = options
  await runWithTruffle(async (opts) => await upgrade({ 
    contractAlias, proxyAddress, initMethod, initArgs, all, force, ... opts
  }), options)
}

export default { name, signature, description, register, action }
