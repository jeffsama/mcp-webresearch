# Testing the MCP Web Research Server

This document outlines the test files available for verifying the MCP Web Research server functionality, with a focus on environment variable loading.

## Test Files

### 1. `test-env.js` (Root Directory)

This script tests if environment variables are loaded correctly from `.env` files. It runs the server from different directories to verify that it consistently uses the correct configuration.

**Purpose:**

- Verify that environment variables are loaded correctly regardless of where the command is run from
- Test multiple execution contexts (running from project root vs. mcp-webresearch directory)
- Provide clear pass/fail indicators for environment variable loading

**How to run:**

```bash
# From the project root
node test-env.js
```

**Example success output:**

```
=== Test: From project root ===
Working directory: /Users/jefftsang/Documents/Projects/mcp-tools
Command: node mcp-webresearch/dist/index.js
MCP Web Research server starting - PID: 35014
Working directory: /Users/jefftsang/Documents/Projects/mcp-tools
Node version: v18.12.1
Claude Desktop integration: DISABLED
Test completed (killed after timeout)

=== Test: From mcp-webresearch directory ===
Working directory: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch
Command: node dist/index.js
MCP Web Research server starting - PID: 35017
Working directory: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch
Node version: v18.12.1
Claude Desktop integration: DISABLED
Test completed (killed after timeout)

All tests completed
```

If the tests pass, you'll see `✅ PASS: Environment variables loaded correctly` in the output for each test.

### 2. `check-env.js` (Root Directory)

A simpler test that just checks if the server loads environment variables by running it directly.

**Purpose:**

- Quick verification that environment variables are loaded
- Helpful for basic troubleshooting

**How to run:**

```bash
# From the project root
node check-env.js
```

**Example success output:**

```
Starting MCP web research server to check environment variables...
MCP Web Research server starting - PID: 34265
Working directory: /Users/jefftsang/Documents/Projects/mcp-tools
Node version: v18.12.1
Claude Desktop integration: DISABLED
Test complete. Shutting down server...
```

### 3. `test-screenshot.cjs` (mcp-webresearch directory)

Tests the basic screenshot functionality using Playwright directly (not through the MCP server).

**Purpose:**

- Verify that Playwright can take screenshots and save them to disk
- Confirm correct file paths and permissions
- Test without the complexity of the MCP server

**How to run:**

```bash
# From the mcp-webresearch directory
node test-screenshot.cjs
```

**Example success output:**

```
Using screenshots directory: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch/screenshots
Launching browser...
Browser launched
Navigating to example.com...
Page loaded
Taking screenshot...
Screenshot taken, size: 25KB
Saving screenshot to: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch/screenshots/test-screenshot-1740656230329.png
File exists: true, size: 25KB
Closing browser...
Done!
```

### 4. `test-build-screenshot.js` (Root Directory)

Tests the screenshot functionality through the MCP server and ensures screenshots are backed up.

**Purpose:**

- Verify that the MCP server can take screenshots
- Test that screenshots are properly backed up to the `screenshot-backups` directory
- Confirm that the backup mechanism works correctly

**How to run:**

```bash
# From the project root
node test-build-screenshot.js
```

**Example success output:**

```
Using screenshots directory: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch/screenshots
Using backup directory: /Users/jefftsang/Documents/Projects/mcp-tools/screenshot-backups

=== Starting MCP Web Research Server (Built Version) ===
Working directory: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch
Command: node dist/index.js
MCP Web Research server starting - PID: 42200
Server started successfully!
Working directory: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch
Node version: v18.12.1
Claude Desktop integration: DISABLED

=== Running screenshot test for hk01.com ===
...
Screenshot taken, size: 900KB
...

=== Finding the most recent screenshot ===
Latest screenshot: /Users/jefftsang/Documents/Projects/mcp-tools/mcp-webresearch/screenshots/test-screenshot-1740672912652.png
Creating backup copy at: /Users/jefftsang/Documents/Projects/mcp-tools/screenshot-backups/test-screenshot-1740672912652.png
Backup created successfully. File size: 900KB

=== Test completed, shutting down server ===

✅ Build version test completed successfully!
```

After running this test, you can find the backed-up screenshots in the `screenshot-backups` directory in the project root.

## Helper Scripts

### 1. `run-webresearch.js`

A helper script that loads the `.env` file from the script directory and then runs the main server.

**Purpose:**

- Ensures environment variables are loaded from the correct location
- Provides detailed logging of environment variable loading
- Useful for standalone execution

**How to run:**

```bash
# From any directory
node /path/to/mcp-webresearch/run-webresearch.js
```

### 2. `run-webresearch.sh`

A shell script version of the helper that does the same thing as `run-webresearch.js`.

**Purpose:**

- Shell script alternative for environments where that's preferred
- Provides detailed logging of environment variable loading

**How to run:**

```bash
# Make it executable first if needed
chmod +x /path/to/mcp-webresearch/run-webresearch.sh

# Then run it
/path/to/mcp-webresearch/run-webresearch.sh
```

## Troubleshooting

If tests fail, check:

1. **File locations**: Make sure `.env` file exists in the correct location
2. **File contents**: Verify that `.env` contains the correct variables:
   ```
   CLAUDE_DESKTOP_AVAILABLE=false
   ```
3. **Node version**: Confirm you're using Node.js v18 or higher
4. **Screenshots**: Check the `screenshot-backups` directory in the project root for backed-up screenshots
