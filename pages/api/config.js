// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { publicRuntimeConfig, serverRuntimeConfig } from '../../lib/server-runtime';

/**
 * Obviously you would not want to expose secrets to the browser,
 * this is just to show what variables are being set to the object
 * that is passed to serverRuntimeConfig, and what is accessible
 * from API routes.
 */
export default function config(req, res) {
  res.status(200).json({ name: 'Config', publicRuntimeConfig, serverRuntimeConfig })
}
