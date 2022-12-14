# With Runtime Environment-Specific Variables

## What is this

This example demonstrates a method for using environment specific, runtime variables with Docker containers. The problem this solves is that Next.js violates the "build once, deploy anywhere" paradigm because environment variables are applied at build time. Meaning, in order to apply environment variables for a development environment and a production environment, one has to build two separate Docker images.

## How to use

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build your container: `docker build -t nextjs-docker .`
3. Run your container with `-e` or `--env` flags:
```bash
docker run -p 3000:3000 -e RUNTIME_CLIENT_VARIABLE=runtime_client_var -e RUNTIME_PRIVATE_SERVER_VARIABLE=runtime_server_var nextjs-docker
```

## How it works

The solution presented here uses the `ENV` command in the `Dockerfile` to replace predefined `NEXT_RUNTIME_` variables with `APP_NEXT_RUNTIME_`. This is to prevent Next.js from setting the values at build time when it digests all the `process.env.*` variables.

The next step is to use the `entrypoint.sh` script which is executed at "runtime" with `docker run`.
Our script pulls the `env` variables, in our personal use-case they are defined by AWS Task Definitions, that are inserted into the command like so `docker run -e Var1 -e Var2...`. We then replace the `APP_NEXT_RUNTIME_*` strings with an actual value. This has its own complications, but hopefully explained below.

Handling the variables is up to you, but in `next.config.js` we spread `server-config` and `client-config` objects separately, to prevent `serverRuntimeConfig` secrets from leaking into the `publicRuntimeConfig`. I am hesitant to suggest our method is full proof, and should be used cautiously. But there are additional reasons for this method as I will try to explain.

The `lib/server-config.js` and `lib/client-config.js` files behave similarly. In our environment,
we do not need to set every variable, but want to rely on some default values that change depending on production vs development.

We build a `defaultConfig` object with our default values, and then build an `environmentConfig` object that merges the `defaultConfig` against a new set of values we want to use as the default values for that specific environment.

The final step is the `lib/client-runtime.js` and `lib/server-runtime.js`. We only use one `runtime-config.js`, but in this example it is broken down to experiment between the two differences. The contents are a utility to import the Next.js config without having to do the tedious parts of the import every time we need to use it, but most importantly, we merge the `*-config.js` files as we export the runtime configuration. We do this because at `Docker build...` all our runtime variables are replaced with `APP_NEXT_RUNTIME_*`. If a value is not passed at runtime, the string has already been set... and here is the complications we hinted to above.

Normally, we would do something like, `process.env.VAR || 'default-value'`. But at runtime, the condition would look like `'APP_NEXT_RUNTIME_VAR' || 'default-value'` -- the value will always be the string: `APP_NEXT_RUNTIME_VAR`. This is not good, obviously. So when we export the runtime configuration, we execute a utility `mergeRuntimeEnvironment` that defers to `default-value` instead of the `APP_NEXT_RUNTIME_*` string if `APP_NEXT_` is detected.

# Forked from "With Docker"

This examples shows how to use Docker with Next.js based on the [deployment documentation](https://nextjs.org/docs/deployment#docker-image). Additionally, it contains instructions for deploying to Google Cloud Run. However, you can use any container-based deployment host.

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-docker nextjs-docker
# or
yarn create next-app --example with-docker nextjs-docker
# or
pnpm create next-app --example with-docker nextjs-docker
```

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
1. Build your container: `docker build -t nextjs-docker .`.
1. Run your container: `docker run -p 3000:3000 nextjs-docker`.

You can view your images created with `docker images`.

### In existing projects

To add support for Docker to an existing project, just copy the `Dockerfile` into the root of the project and add the following to the `next.config.js` file:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: 'standalone',
}
```

This will build the project as a standalone app inside the Docker image.

## Deploying to Google Cloud Run

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) so you can use `gcloud` on the command line.
1. Run `gcloud auth login` to log in to your account.
1. [Create a new project](https://cloud.google.com/run/docs/quickstarts/build-and-deploy) in Google Cloud Run (e.g. `nextjs-docker`). Ensure billing is turned on.
1. Build your container image using Cloud Build: `gcloud builds submit --tag gcr.io/PROJECT-ID/helloworld --project PROJECT-ID`. This will also enable Cloud Build for your project.
1. Deploy to Cloud Run: `gcloud run deploy --image gcr.io/PROJECT-ID/helloworld --project PROJECT-ID --platform managed`. Choose a region of your choice.

   - You will be prompted for the service name: press Enter to accept the default name, `helloworld`.
   - You will be prompted for [region](https://cloud.google.com/run/docs/quickstarts/build-and-deploy#follow-cloud-run): select the region of your choice, for example `us-central1`.
   - You will be prompted to **allow unauthenticated invocations**: respond `y`.

Or click the button below, authorize the script, and select the project and region when prompted:

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/vercel/next.js.git&dir=examples/with-docker)

## Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
