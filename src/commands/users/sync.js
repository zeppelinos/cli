import sync from '../../scripts/sync'
import runWithTruffle from '../../utils/runWithTruffle'

function registerSync(program) {
  program
    .command('sync')
    .description('Sync your project with the blockchain')
    .usage('--network <network> [options]')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('-n, --network <network>', 'Provide a network to be used')
    .option('--deploy-stdlib', 'Deploys a copy of the stdlib (if any) instead of using the one already published to the network by its author (useful in local testrpc networks)')
    .option('--reupload', 'Reuploads all contracts, regardless of not having been modified')
    .action(action)
}

function action(options) {
  const { from, network, deployStdlib, reupload } = options
  const txParams = from ? { from } : {}
  runWithTruffle(async () => await sync({ network, deployStdlib, reupload, txParams }), network)
}

module.exports = registerSync
module.exports.action = action
