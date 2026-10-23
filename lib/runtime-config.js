// Only these public values can cross the server-to-browser boundary.
exports.getPublicRuntimeConfig = () => ({
  client: 'client-variable',
  clientRuntime: process.env.RUNTIME_CLIENT_VARIABLE || 'default_prod_client_runtime',
  clientUnset: process.env.RUNTIME_CLIENT_UNSET_VARIABLE || 'default_prod_client_unset_runtime',
});
