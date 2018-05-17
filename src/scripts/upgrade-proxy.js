import LocalAppController from "../models/local/LocalAppController";
import stdout from '../utils/stdout';
import _ from 'lodash';

export default async function upgradeProxy({ contractAlias, proxyAddress, initMethod, initArgs, all, network, txParams = {}, packageFileName = undefined, networkFileName = undefined, force = false }) {
  if (!contractAlias && !all) {
    throw Error('The contract name to upgrade must be provided, or explicit upgrading all proxies in the application.')
  }

  const appController = new LocalAppController(packageFileName).onNetwork(network, txParams, networkFileName);
  await appController.checkLocalContractsDeployed(!force);
  const proxies = await appController.upgradeProxies(contractAlias, proxyAddress, initMethod, initArgs);
  appController.writeNetworkPackage();
  _(proxies).values().forEach(proxy => stdout(proxy.address));
}
