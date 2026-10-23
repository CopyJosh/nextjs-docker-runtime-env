# Runtime environment example

This example reads public values on each server request. Build the image once, then supply environment values when it starts.

Use Node 24 and `npm ci`. Run `npm run build` before `npm start`.

The page and `/api/config` return only the explicit public fields in `lib/runtime-config.js`.
`RUNTIME_CLIENT_VARIABLE` and `RUNTIME_CLIENT_UNSET_VARIABLE` are public. Do not put secrets in these variables.
Private variables stay on the server. The example does not return or log them.
The entrypoint starts the server without edits to generated JavaScript.

To test the container locally:

```sh
docker build -t nextjs-runtime-local .
docker run --rm -p 3000:3000 -e RUNTIME_CLIENT_VARIABLE=example nextjs-runtime-local
```

No deployment is established for this legacy example. Do not use this change to restore a public service.
