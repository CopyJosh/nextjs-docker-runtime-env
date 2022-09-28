#!/usr/bin/env bash
set -Ex

function apply_path {
  # Get environment variables prefix with RUNTIME_*
  envs="${!RUNTIME_@}"

  # For each env
  for matched_env in $envs; do
   # Test there is a value, then find and replace...
   test -n "${!matched_env}" && find /app \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i  "s#APP_NEXT_$matched_env#${!matched_env}#g"
  done
}

apply_path
echo "Starting Nextjs"
exec "$@"
