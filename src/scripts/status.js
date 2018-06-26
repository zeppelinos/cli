import _ from 'lodash';
import { Logger } from 'zos-lib';
import ControllerFor from "../models/local/ControllerFor";

let log = new Logger('scripts/status');

export default async function status({ network, txParams = {}, packageFileName = undefined, networkFileName = undefined, logger = undefined }) {
  if (logger) log = logger;
  const controller = ControllerFor(packageFileName).onNetwork(network, txParams, networkFileName);
  log.info(`Project status for network ${network}`);

  if (!(await rootInfo(controller))) return;
  if (!(await versionInfo(controller.networkFile))) return;
  await stdlibInfo(controller.networkFile);
  await contractsInfo(controller);
  await proxiesInfo(controller.networkFile);
}

function rootInfo(controller) {
  return controller.isLib ? libInfo(controller) : appInfo(controller);
}

async function appInfo(controller) {
  if (!controller.appAddress) {
    log.info(`Application is not yet deployed`);
    return false;
  }

  await controller.fetch();
  log.info(`Application is deployed at ${controller.appAddress}`);
  log.info(`- Proxy factory is at ${controller.app.factory.address}`);
  log.info(`- Package is at ${controller.app.package.address}`);
  return true;
}

async function libInfo(controller) {
  if (!controller.packageAddress) {
    log.info(`Library is not yet deployed`);
    return false;
  }

  await controller.fetch();
  log.info(`Library package is deployed at ${controller.packageAddress}`);
  return true;
}

async function versionInfo(networkFile) {
  if (networkFile.hasMatchingVersion()) {
    log.info(`- Deployed version ${networkFile.version} matches the latest one defined`)
    return true;
  } else {
    log.info(`- Deployed version ${networkFile.version} is out of date (latest is ${networkFile.packageFile.version})`)
    return false;
  }
}

async function contractsInfo(controller) {
  log.info('Application contracts:');
  if (_.isEmpty(controller.packageFile.contracts)) {
    log.info(`- No contracts registered`);
    return;
  }

  _.each(controller.packageFile.contracts, function (contractName, contractAlias) {
    const isDeployed = controller.isContractDeployed(contractAlias);
    const hasChanged = controller.hasContractChanged(contractAlias);
    const fullName = contractName === contractAlias ? contractAlias : `${contractAlias} (implemented by ${contractName})`;
    if (!isDeployed) {
      log.info(`- ${fullName} is not deployed`);
    } else if (hasChanged) {
      log.info(`- ${fullName} is out of date with respect to the local version`);
    } else {
      log.info(`- ${fullName} is deployed and up to date`);
    }
  });
}

async function stdlibInfo(networkFile) {
  if (networkFile.isLib) return;
  const packageFile = networkFile.packageFile
  log.info('Standard library:');

  if (!packageFile.hasStdlib()) {
    const deployedWarn = networkFile.hasStdlib() ? `(though ${networkFile.stdlibName}@${networkFile.stdlibVersion} is currently deployed)` : '';
    log.info(`- No stdlib specified for current version ${deployedWarn}`);
    return;
  }

  log.info(`- Stdlib ${packageFile.stdlibName}@${packageFile.stdlibVersion} required by current version`);

  if (!networkFile.hasStdlib()) {
    log.info(`- No stdlib is deployed`);
  } else if (networkFile.hasMatchingCustomDeploy()) {
    log.info(`- Custom deploy of stdlib set at ${networkFile.stdlibAddress}`);
  } else if (networkFile.hasCustomDeploy()) {
    log.info(`- Custom deploy of different stdlib ${networkFile.stdlibName}@${networkFile.stdlibVersion} at ${networkFile.stdlibAddress}`);
  } else if (packageFile.hasStdlib(networkFile.stdlib)) {
    log.info(`- Deployed application is correctly connected to stdlib`);
  } else {
    log.info(`- Deployed application is connected to different stdlib ${networkFile.stdlibName}@${networkFile.stdlibVersion}`);
  }
}

async function proxiesInfo(networkFile) {
  if (networkFile.isLib) return;
  log.info("Deployed proxies:");

  if (!networkFile.hasProxies()) {
    log.info('- No proxies created');
    return;
  }

  _.each(networkFile.proxies, (proxyInfos, alias) => {
    _.each(proxyInfos, ({ address, version }) => {
      log.info(`- ${alias} at ${address} version ${version}`);
    });
  });
}