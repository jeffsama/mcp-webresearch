#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Get the directory where the script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the path to the .env file - use the script directory
const scriptDir = __dirname;
const envPath = path.resolve(scriptDir, ".env");

// Load environment variables from .env if it exists
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  const envConfig = dotenv.parse(fs.readFileSync(envPath));

  // Apply environment variables
  Object.entries(envConfig).forEach(([key, value]) => {
    process.env[key] = value;
    console.log(`Set ${key}=${value}`);
  });
} else {
  console.log(`No .env file found at ${envPath}`);
}

// Path to the main script
const scriptPath = path.resolve(scriptDir, "dist", "index.js");

// Execute the main script with the loaded environment variables
console.log(`Executing ${scriptPath}`);
try {
  execSync(`node ${scriptPath}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  console.error("Error executing script:", error);
  process.exit(1);
}
