#!/bin/bash

set -e

MAIN_FILE="src/main.ts"
MAIN_BACKUP="src/main.ts.bak"
ELEMENT_MAIN="src/main.element.ts"

echo "Starting element dev server (without zoneless)..."

# Backup original main.ts
cp "$MAIN_FILE" "$MAIN_BACKUP"

# Use element main.ts
cp "$ELEMENT_MAIN" "$MAIN_FILE"

# Trap to restore on exit (Ctrl+C)
trap "mv '$MAIN_BACKUP' '$MAIN_FILE'; echo 'Element server stopped. Restored main.ts'" EXIT

# Run the dev server
ng serve --open
