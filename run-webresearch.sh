#!/bin/bash

# Navigate to the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Load environment variables from .env file in the script directory
if [ -f ".env" ]; then
  echo "Loading environment variables from $SCRIPT_DIR/.env"
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found in $SCRIPT_DIR"
fi

# Echo the environment variables for debugging
echo "MCP_SCREENSHOTS_DIR=$MCP_SCREENSHOTS_DIR"
echo "CLAUDE_DESKTOP_AVAILABLE=$CLAUDE_DESKTOP_AVAILABLE"

# Run the actual script
node dist/index.js 