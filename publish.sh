#!/usr/bin/env bash
if [ -z $1 ]; then
  echo "Must specify version first argument"
  exit 1
fi

[ -d docs ] && git rm -rf docs && git commit -a -m 'removed docs'

npm version $1 && \
npm run demo && \
git add docs && \
git commit -a -m 'add docs' && \
npm publish && \
git push --tags
