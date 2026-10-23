const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { cpSync } = require('node:fs');
const { once } = require('node:events');

(async () => {
  cpSync('.next/static', '.next/standalone/.next/static', { recursive: true });
  cpSync('public', '.next/standalone/public', { recursive: true });
  const publicValue = 'public "value" & / # <script>example</script>';
  const secret = 'private-security-sentinel';
  const child = spawn(process.execPath, ['.next/standalone/server.js'], {
    env: { ...process.env, HOSTNAME: '127.0.0.1', PORT: '41976', RUNTIME_CLIENT_VARIABLE: publicValue,
      RUNTIME_PRIVATE_SERVER_VARIABLE: secret, FROM_ENV_FILE: secret },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', data => { logs += data; });
  child.stderr.on('data', data => { logs += data; });
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Server did not start')), 15000);
      child.stdout.on('data', () => {
        if (logs.includes('Ready')) { clearTimeout(timeout); resolve(); }
      });
      child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}`)); });
    });
    const base = 'http://127.0.0.1:41976';
    const response = await fetch(base + '/api/config');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const data = await response.json();
    assert.equal(data.publicRuntimeConfig.clientRuntime, publicValue);
    assert.equal(data.publicRuntimeConfig.clientUnset, 'default_prod_client_unset_runtime');
    assert.equal(data.serverRuntimeConfig, undefined);
    const html = await (await fetch(base)).text();
    assert(html.includes('Welcome'));
    let output = html + JSON.stringify(data);
    for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
      output += await (await fetch(base + src)).text();
    }
    assert(!output.includes(secret));
    assert(!logs.includes(secret));
    console.log('PASS standalone page, API, public runtime value, default, private response/bundle/log exclusion');
  } finally {
    child.kill();
    await once(child, 'exit');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
