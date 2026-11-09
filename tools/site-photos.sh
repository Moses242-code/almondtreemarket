#!/bin/sh
# Rebuild photos.json from js/data.js (the inventory app reads it). Runs on every commit via .git/hooks/pre-commit.
cd "$(dirname "$0")/.." || exit 1
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tools/photos-json.js > photos.json.tmp && mv photos.json.tmp photos.json
