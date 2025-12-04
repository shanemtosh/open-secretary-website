#!/bin/bash
# Adds ?v=<git-hash> to CSS/JS references in HTML files for cache busting

set -e
cd "$(dirname "$0")"

VERSION=$(git rev-parse --short HEAD)
echo "Building with version: $VERSION"

for file in html/index.html html/demo/index.html; do
    if [ -f "$file" ]; then
        echo "Processing $file"
        sed -i.bak -E "s/(href=\"[^\"]*\.css)\?v=[a-f0-9]+\"/\1?v=$VERSION\"/g" "$file"
        sed -i.bak -E "s/(href=\"[^\"]*\.css)\"/\1?v=$VERSION\"/g" "$file"
        sed -i.bak -E "s/(src=\"[^\"]*\.js)\?v=[a-f0-9]+\"/\1?v=$VERSION\"/g" "$file"
        sed -i.bak -E "s/(src=\"[^\"]*\.js)\"/\1?v=$VERSION\"/g" "$file"
        rm -f "$file.bak"
    fi
done

echo "Build complete"
