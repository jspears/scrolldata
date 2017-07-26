#!/usr/bin/env bash

npm version $1 && \
git rm -rf docs && \
npm run demo && \
git add docs && \
npm publish && \
git push --tags
