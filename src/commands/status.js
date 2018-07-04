'use strict';

import status from '../scripts/status'
import runWithTruffle from '../utils/runWithTruffle'

const name = 'status'
const signature = name
const description = 'print information about the local status of your app in a specific network'

const register = program => program
  .command(signature, { noHelp: true })
  .description(description)
  .usage('--network <network>')
  .option('-n, --network <network>', 'network to be used')
  .option('--timeout <timeout>', 'timeout in seconds for blockchain transactions')
  .option('-f, --from <from>', 'specify transaction sender address')
  .action(action)

async function action(options) {
  const { from, network, timeout } = options
  const txParams = from ? { from } : {}
  await runWithTruffle(async () => await status({ txParams, network }), network, { timeout })
}

export default { name, signature, description, register, action }
