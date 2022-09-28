/**
 * This is for variables that we have set default values for,
 * but depending on the environment, that default value might be different.
 */
const merge = require('./utils').merge;

const env = process.env.NODE_ENV || 'development';

// Default values across all environments
const defaultConfig = {
  randomDefaultVar: 'random-default-var',
  clientBuildtime: process.env.BUILDTIME_CLIENT_VARIABLE || "default_client_buildtime",
  clientRuntime: process.env.NEXT_RUNTIME_CLIENT_VARIABLE || "default_client_runtime",
  // Point of this variable is to see that if you do not set the variable at runtime, it won't
   // default to "APP_NEXT_RUNTIME_CLIENT_UNSET_VARIABLE" as a string
  clientUnset: process.env.NEXT_RUNTIME_CLIENT_UNSET_VARIABLE || "default_client_unset_runtime",
};

const environmentConfig = {
  // Default values specific to dev environment
  development: {
    ...merge(defaultConfig, {
      clientBuildtime: process.env.BUILDTIME_CLIENT_VARIABLE || "default_dev_client_buildtime",
      clientRuntime: process.env.NEXT_RUNTIME_CLIENT_VARIABLE || "default_dev_client_runtime",
      clientUnset: process.env.NEXT_RUNTIME_CLIENT_UNSET_VARIABLE || "default_dev_client_unset_runtime",
    }),
  },

  // Default values specific to prod environment
  production: {
    ...merge(defaultConfig, {
      clientBuildtime: process.env.BUILDTIME_CLIENT_VARIABLE || "default_prod_client_buildtime",
      clientRuntime: process.env.NEXT_RUNTIME_CLIENT_VARIABLE || "default_prod_client_runtime",
      clientUnset: process.env.NEXT_RUNTIME_CLIENT_UNSET_VARIABLE || "default_prod_client_unset_runtime",
    }),
  },
};

module.exports = {
  ...environmentConfig[env],
};
