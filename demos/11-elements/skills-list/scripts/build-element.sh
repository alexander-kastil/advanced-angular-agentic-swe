#!/bin/bash

set -e

MAIN_FILE="src/main.ts"
MAIN_BACKUP="src/main.ts.bak"
ELEMENT_MAIN="src/main.element.ts"

echo "Building Angular Element (without zoneless)..."

# Backup original main.ts
cp "$MAIN_FILE" "$MAIN_BACKUP"

# Use element main.ts for build
cp "$ELEMENT_MAIN" "$MAIN_FILE"

# Run the build
ng build -c production --output-hashing none

# Restore original main.ts
mv "$MAIN_BACKUP" "$MAIN_FILE"

echo "Element build complete! Output is in dist/<project-name>/"
