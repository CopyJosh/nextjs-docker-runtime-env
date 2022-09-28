/**
 * Client supported duplication of server-config.js
 */
import getConfig from 'next/config';
import environmentConfig from './client-config';

function merge(config) {
  for (const [key] of Object.entries(environmentConfig)) {
    // Ignore if default value was not replaced by entrypoint.sh
    if (typeof config[key] === 'string' && !config[key].startsWith('APP_NEXT_')) {
      environmentConfig[key] = config[key];
    }
  }

  return environmentConfig;
};

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { publicRuntimeConfig = {}, serverRuntimeConfig = {} } = getConfig() || {};

const config = merge(publicRuntimeConfig);
const serverConfig = merge(serverRuntimeConfig);

export {
  config as publicRuntimeConfig,
  serverConfig as serverRuntimeConfig,
};
