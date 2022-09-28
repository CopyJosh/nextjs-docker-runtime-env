const omitUndefined = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );

/**
 * Merge two objects together, without letting object "a"
 * key values be overwritten by undefined values in object "b"
 */
const merge = (a, b) => Object.assign(a, omitUndefined(b));

/**
 * Merge the runtime configuration with our env variables.
 * If our "runtime variable" was defined at runtime, the
 * placeholder value, "APP_NEXT_RUNTIME_*" will be replaced with the value we want.
 * The for-loop updates our default configuration object with the values from runtime,
 */
const mergeRuntimeEnvironment = (runtime, env) => {
  for (const [key] of Object.entries(env)) {
    // Ignore value if it was not replaced by entrypoint.sh
    if (typeof runtime[key] === 'string' && !runtime[key].startsWith('APP_NEXT_RUNTIME_')) {
      env[key] = runtime[key];
    }
  }

  return env;
};

module.exports = {
  merge,
  mergeRuntimeEnvironment,
};
