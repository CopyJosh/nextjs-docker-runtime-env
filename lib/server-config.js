/**
 * This is for variables that we have set default values for,
 * but depending on the environment, that default value might be different.
 */
 const merge = require('./utils').merge;

 const env = process.env.NODE_ENV || 'development';
 
 // Default values across all environments
 const defaultSecrets = {
   randomServerSecret: 'random-server-secret',
   serverBuildtime: process.env.BUILDTIME_SERVER_VARIABLE || "default_server_buildtime",
   serverRuntime: process.env.NEXT_RUNTIME_PRIVATE_SERVER_VARIABLE || "default_server_runtime",
   // Point of this variable is to see that if you do not set the variable at runtime, it won't
   // default to "APP_NEXT_RUNTIME_SERVER_UNSET_VARIABLE" as a string
   serverUnset: process.env.NEXT_RUNTIME_SERVER_UNSET_VARIABLE || "default_server_unset_runtime",
 };
 
 const environmentSecrets = {
   // Default values specific to dev environment
   development: {
     ...merge(defaultSecrets, {
       serverBuildtime: process.env.BUILDTIME_SERVER_VARIABLE || "default_dev_server_buildtime",
       serverRuntime: process.env.NEXT_RUNTIME_PRIVATE_SERVER_VARIABLE || "default_dev_server_runtime",
       serverUnset: process.env.NEXT_RUNTIME_SERVER_UNSET_VARIABLE || "default_dev_server_unset_runtime",
     }),
   },
 
   // Default values specific to prod environment
   production: {
     ...merge(defaultSecrets, {
       serverBuildtime: process.env.BUILDTIME_SERVER_VARIABLE || "default_prod_server_buildtime",
       serverRuntime: process.env.NEXT_RUNTIME_PRIVATE_SERVER_VARIABLE || "default_prod_server_runtime",
       serverUnset: process.env.NEXT_RUNTIME_SERVER_UNSET_VARIABLE || "default_prod_server_unset_runtime",
     }),
   },
 };
 
 module.exports = {
   ...environmentSecrets[env],
 };
 