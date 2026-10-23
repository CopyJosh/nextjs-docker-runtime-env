import { getPublicRuntimeConfig } from '../../lib/runtime-config';

export default function config(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ name: 'Config', publicRuntimeConfig: getPublicRuntimeConfig() });
}
