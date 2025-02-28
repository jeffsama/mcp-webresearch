const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

// Get the absolute path to the mcp-webresearch directory
const MCP_WEBRESEARCH_DIR = path.resolve(__dirname);
console.log(`MCP Webresearch directory: ${MCP_WEBRESEARCH_DIR}`);

// Define screenshots directory
const SCREENSHOTS_DIR =
  process.env.MCP_SCREENSHOTS_DIR ||
  path.join(MCP_WEBRESEARCH_DIR, "screenshots");

// Also save a copy to the Desktop for verification
const DESKTOP_DIR = path.join(os.homedir(), "Desktop");

console.log(`Using screenshots directory: ${SCREENSHOTS_DIR}`);
console.log(`Also saving a copy to: ${DESKTOP_DIR}`);
console.log(
  `Environment variable MCP_SCREENSHOTS_DIR=${process.env.MCP_SCREENSHOTS_DIR}`
);
console.log(`Home directory: ${os.homedir()}`);

// Create the directory if it doesn't exist
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  console.log(`Created directory: ${SCREENSHOTS_DIR}`);
}

// Create a test file to verify directory access
const testFilePath = path.join(SCREENSHOTS_DIR, "test-access.txt");
try {
  fs.writeFileSync(testFilePath, "Testing directory access");
  console.log(`Successfully wrote test file to ${testFilePath}`);

  // Verify the test file exists
  if (fs.existsSync(testFilePath)) {
    console.log(`Test file exists: ${testFilePath}`);
    const testFileContents = fs.readFileSync(testFilePath, "utf8");
    console.log(`Test file contents: ${testFileContents}`);

    // List directory contents to verify
    console.log(`Directory contents after creating test file:`);
    const dirContents = execSync(`ls -la "${SCREENSHOTS_DIR}"`).toString();
    console.log(dirContents);
  } else {
    console.error(`ERROR: Test file does not exist: ${testFilePath}`);
  }
} catch (error) {
  console.error(`Failed to write test file: ${error.message}`);
}

async function takeAndSaveScreenshot() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  console.log("Browser launched");

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to hk01.com...");
  await page.goto("https://www.hk01.com", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  console.log("Page loaded (DOM content)");

  // Wait a bit longer to ensure some content is loaded
  console.log("Waiting for 5 seconds to allow content to load...");
  await page.waitForTimeout(5000);

  console.log("Taking screenshot...");
  const screenshot = await page.screenshot({ timeout: 60000 });
  console.log(
    `Screenshot taken, size: ${Math.round(screenshot.length / 1024)}KB`
  );

  const timestamp = new Date().getTime();
  const filename = `test-screenshot-${timestamp}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  const desktopFilepath = path.join(DESKTOP_DIR, filename);

  // Save directly to the screenshots directory
  console.log(`Saving screenshot directly to: ${filepath}`);
  try {
    fs.writeFileSync(filepath, screenshot);
    console.log(`Screenshot saved directly to: ${filepath}`);
  } catch (error) {
    console.error(`Failed to save screenshot directly: ${error.message}`);
  }

  // Also save to desktop for verification
  console.log(`Saving a copy to desktop: ${desktopFilepath}`);
  try {
    fs.writeFileSync(desktopFilepath, screenshot);
    console.log(`Screenshot saved to desktop: ${desktopFilepath}`);
  } catch (error) {
    console.error(`Failed to save to desktop: ${error.message}`);
  }

  // Verify files exist
  console.log(`Verifying files exist...`);
  const screenshotExists = fs.existsSync(filepath);
  const desktopExists = fs.existsSync(desktopFilepath);

  console.log(`Screenshots dir file exists: ${screenshotExists}`);
  if (screenshotExists) {
    const fileSize = fs.statSync(filepath).size;
    console.log(`Screenshot file size: ${Math.round(fileSize / 1024)}KB`);
  }

  console.log(`Desktop file exists: ${desktopExists}`);
  if (desktopExists) {
    const fileSize = fs.statSync(desktopFilepath).size;
    console.log(`Desktop file size: ${Math.round(fileSize / 1024)}KB`);
  }

  // List directory contents using system command
  console.log(`Listing screenshots directory contents after saving:`);
  try {
    const dirContents = execSync(`ls -la "${SCREENSHOTS_DIR}"`).toString();
    console.log(dirContents);
  } catch (error) {
    console.error(`Failed to list directory: ${error.message}`);
  }

  console.log("Closing browser...");
  await browser.close();
  console.log("Done!");

  return filepath;
}

takeAndSaveScreenshot()
  .then((filepath) => {
    console.log(`\nFinal verification of screenshot:`);
    const exists = fs.existsSync(filepath);
    console.log(`File exists (final check): ${exists}`);
    if (exists) {
      const stats = fs.statSync(filepath);
      console.log(`File size: ${Math.round(stats.size / 1024)}KB`);
      console.log(`File permissions: ${stats.mode.toString(8)}`);
      console.log(`File created: ${stats.birthtime}`);
    }

    // Final directory listing
    console.log(`\nFinal directory listing:`);
    const dirContents = execSync(`ls -la "${SCREENSHOTS_DIR}"`).toString();
    console.log(dirContents);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
