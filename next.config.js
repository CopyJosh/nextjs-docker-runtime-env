/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',

  serverRuntimeConfig: {
    server: 'server-variable',
    secret: process.env.FROM_ENV_FILE,
    serverBuildtime: process.env.BUILDTIME_SERVER_VARIABLE,
    serverRuntime: process.env.NEXT_RUNTIME_PRIVATE_SERVER_VARIABLE,
  },

  publicRuntimeConfig: {
    client: 'client-variable',
    clientBuildtime: process.env.BUILDTIME_CLIENT_VARIABLE,
    clientRuntime: process.env.NEXT_RUNTIME_CLIENT_VARIABLE,
  }
}
