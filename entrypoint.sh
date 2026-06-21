#!/bin/sh

set -e

npx drizzle-kit push

exec node .output/server/index.mjs
