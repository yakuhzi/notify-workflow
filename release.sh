#!/bin/bash
# Actions requires a node_modules dir https://github.com/actions/toolkit/blob/master/docs/javascript-action.md#publish-a-releasesv1-action
# It is recommended not to check these in https://github.com/actions/toolkit/blob/master/docs/action-versioning.md#recommendations

git checkout -b releases/v3
rm -rf node_modules dist
npm install
npm run build
git add -f node_modules dist
git commit -m "Chore: Update node_modules & dist"
git push -f origin releases/v3

git push origin :refs/tags/v3
git tag -f v3
git push origin v3
git checkout main
git branch -D releases/v3
npm install
