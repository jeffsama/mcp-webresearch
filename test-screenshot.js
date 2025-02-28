const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const os = require("os");

const SCREENSHOTS_DIR =
  process.env.MCP_SCREENSHOTS_DIR ||
  path.join(os.homedir(), ".mcp-screenshots");

console.log(`Using screenshots directory: ${SCREENSHOTS_DIR}`);

// Create the directory if it doesn't exist
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  console.log(`Created directory: ${SCREENSHOTS_DIR}`);
}

async function takeAndSaveScreenshot() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  console.log("Browser launched");

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to example.com...");
  await page.goto("https://example.com");
  console.log("Page loaded");

  console.log("Taking screenshot...");
  const screenshot = await page.screenshot();
  console.log(
    `Screenshot taken, size: ${Math.round(screenshot.length / 1024)}KB`
  );

  const timestamp = new Date().getTime();
  const filename = `test-screenshot-${timestamp}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);

  console.log(`Saving screenshot to: ${filepath}`);
  await fs.promises.writeFile(filepath, screenshot);

  // Verify file exists
  const fileExists = fs.existsSync(filepath);
  const fileSize = fileExists ? fs.statSync(filepath).size : 0;
  console.log(
    `File exists: ${fileExists}, size: ${Math.round(fileSize / 1024)}KB`
  );

  console.log("Closing browser...");
  await browser.close();
  console.log("Done!");
}

takeAndSaveScreenshot().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
