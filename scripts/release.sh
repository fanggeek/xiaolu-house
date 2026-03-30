#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Check git working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Git working directory not clean"
  exit 1
fi

# Bump version (creates commit + tag)
# Usage: npm run release [patch|minor|major]
VERSION_TYPE="${1:-patch}"
npm version "$VERSION_TYPE"

# Push commit and tag to trigger GitHub Actions release
git push
git push --tags