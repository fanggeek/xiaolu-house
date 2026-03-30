#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Check git working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Git working directory not clean"
  exit 1
fi

# Bump version (creates commit + tag)
npm version patch

# Build
npm run build

# Publish
npm publish