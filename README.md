# MCP Web Research Server

A Model Context Protocol (MCP) server for web research.

Bring real-time info into Claude and easily research any topic.

## Features

- Google search integration
- Webpage content extraction
- Research session tracking (list of visited pages, search queries, etc.)
- Screenshot capture

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18 (includes `npm` and `npx`)
- [Claude Desktop app](https://claude.ai/download) (optional - for direct Claude integration)

## Installation

### Option 1: With Claude Desktop Integration (Optional)

If you want to integrate with Claude Desktop:

1. Download and install the [Claude Desktop app](https://claude.ai/download)
2. Add this entry to your `claude_desktop_config.json` (on Mac, found at `~/Library/Application\ Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "webresearch": {
      "command": "npx",
      "args": ["-y", "@mzxrai/mcp-webresearch@latest"]
    }
  }
}
```

This config allows Claude Desktop to automatically start the web research MCP server when needed.

### Option 2: Standalone Usage

To use without Claude Desktop:

```bash
# Install globally
npm install -g @mzxrai/mcp-webresearch

# Run with environment variables
MCP_SCREENSHOTS_DIR=/path/to/screenshots CLAUDE_DESKTOP_AVAILABLE=false mcp-webresearch
```

## Usage

### With Claude Desktop

Simply start a chat with Claude and send a prompt that would benefit from web research. If you'd like a prebuilt prompt customized for deeper web research, you can use the `agentic-research` prompt that we provide through this package. Access that prompt in Claude Desktop by clicking the Paperclip icon in the chat input and then selecting `Choose an integration` → `webresearch` → `agentic-research`.

<img src="https://i.ibb.co/N6Y3C0q/Screenshot-2024-12-05-at-11-01-27-PM.png" alt="Example screenshot of web research" width="400"/>

### Standalone Usage

When using without Claude Desktop, results and screenshots will be saved to the specified directory. You can:

1. Set the `MCP_SCREENSHOTS_DIR` environment variable to specify where screenshots are saved
2. Set `CLAUDE_DESKTOP_AVAILABLE=false` to enable appropriate messaging for non-Claude environments
3. Connect to the MCP server using the MCP protocol directly

### Tools

1. `search_google`

   - Performs Google searches and extracts results
   - Arguments: `{ query: string }`

2. `visit_page`

   - Visits a webpage and extracts its content
   - Arguments: `{ url: string, takeScreenshot?: boolean }`

3. `take_screenshot`
   - Takes a screenshot of the current page
   - No arguments required

### Prompts

#### `agentic-research`

A guided research prompt that helps Claude conduct thorough web research. The prompt instructs Claude to:

- Start with broad searches to understand the topic landscape
- Prioritize high-quality, authoritative sources
- Iteratively refine the research direction based on findings
- Keep you informed and let you guide the research interactively
- Always cite sources with URLs

### Resources

We expose two things as MCP resources: (1) captured webpage screenshots, and (2) the research session.

#### Screenshots

When you take a screenshot, it's saved as an MCP resource. In Claude Desktop, you can access captured screenshots via the Paperclip icon. When running standalone, screenshots are saved to the directory specified by `MCP_SCREENSHOTS_DIR`.

#### Research Session

The server maintains a research session that includes:

- Search queries
- Visited pages
- Extracted content
- Screenshots
- Timestamps

### Environment Variables

```bash
# Specify where screenshots are saved (defaults to ~/.mcp-screenshots)
MCP_SCREENSHOTS_DIR=/path/to/screenshots

# Enable/disable Claude Desktop integration (defaults to false)
CLAUDE_DESKTOP_AVAILABLE=true
```

### Suggestions

For the best results, if you choose not to use the `agentic-research` prompt when doing your research, it may be helpful to suggest high-quality sources for Claude to use when researching general topics. For example, you could prompt `news today from reuters or AP` instead of `news today`.

## Problems

This is very much pre-alpha code. And it is also AIGC, so expect bugs.

If you run into issues with Claude Desktop, it may be helpful to check Claude Desktop's MCP logs:

```bash
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Watch for changes
pnpm watch

# Run in development mode
pnpm dev
```

## Testing

Several test scripts are available to verify the functionality of the MCP web research server, especially for testing environment variable loading and screenshot functionality.

See [TESTING.md](./TESTING.md) for detailed documentation on how to use the test scripts and interpret their results.

## Requirements

- Node.js >= 18
- Playwright (automatically installed as a dependency)

## Verified Platforms

- [x] macOS
- [ ] Linux

## License

MIT

## Author

[mzxrai](https://github.com/mzxrai)
