/**
 * Generate .env.local with VITE_RAYFIN_API_URL and VITE_RAYFIN_PUBLISHABLE_KEY from rayfin/.temp/.env
 * This script reads the RAYFIN_WEBSERVICE_HTTP_PORT from the backend configuration
 * and creates/updates .env.local with the appropriate frontend URL and publishable key.
 */

import fs from 'fs';
import path from 'path';

const rayfinEnvPath = path.resolve('./rayfin/.temp/.env');
const envLocalPath = path.resolve('./.env.local');

/**
 * Fetch the publishable key from the WebService API
 * @param {string} port - The port number to connect to
 * @returns {Promise<{key?: string, error?: string}>}
 */
async function fetchPublishableKeyFromApi(port) {
  try {
    const url = `http://localhost:${port}/api/publishable-key`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 503) {
        return { error: 'service_error' };
      }
      return { error: 'not_found' };
    }

    try {
      const data = await response.json();
      if (!data.publishableKey) {
        return { error: 'not_found' };
      }
      return { key: data.publishableKey };
    } catch {
      return { error: 'invalid_json' };
    }
  } catch (error) {
    // Check for timeout
    if (error.name === 'AbortError') {
      return { error: 'timeout' };
    }
    // Check for connection refused (ECONNREFUSED)
    if (
      error.cause?.code === 'ECONNREFUSED' ||
      error.message?.includes('ECONNREFUSED')
    ) {
      return { error: 'connection_refused' };
    }
    // Other network errors
    return { error: 'connection_refused' };
  }
}

/**
 * Main function to generate .env.local
 */
async function main() {
  // Read the rayfin/.temp/.env file
  if (!fs.existsSync(rayfinEnvPath)) {
    console.warn(
      '⚠️  Warning: rayfin/.temp/.env not found. Backend may not be running.'
    );
    console.warn('   Run `npx rayfin dev` to start the backend first.');
    console.warn('   Defaulting to http://localhost:5168');

    // Create or update .env.local with defaults
    updateEnvLocal();
    process.exit(0);
  }

  const rayfinEnvContent = fs.readFileSync(rayfinEnvPath, 'utf-8');

  // Parse RAYFIN_WEBSERVICE_HTTP_PORT
  const portMatch = rayfinEnvContent.match(
    /^RAYFIN_WEBSERVICE_HTTP_PORT=(.*)$/m
  );
  if (!portMatch) {
    console.error(
      '❌ Error: RAYFIN_WEBSERVICE_HTTP_PORT not found in rayfin/.temp/.env'
    );
    console.warn('   Defaulting to http://localhost:5168');
    updateEnvLocal();
    process.exit(0);
  }

  const port = portMatch[1].trim();

  // Try to fetch the publishable key from the API
  console.log(`🔑 Fetching publishable key from http://localhost:${port}...`);
  const keyResult = await fetchPublishableKeyFromApi(port);

  let publishableKey = null;
  if (keyResult.key) {
    publishableKey = keyResult.key;
    console.log(`✅ Retrieved publishable key from API`);
  } else {
    console.warn(
      `⚠️  Could not fetch publishable key: ${keyResult.error || 'unknown error'}`
    );
    console.warn('   Backend may not be running or not fully initialized.');
    console.warn(
      '   VITE_RAYFIN_PUBLISHABLE_KEY will not be set in .env.local'
    );
  }

  updateEnvLocal(port, publishableKey);

  console.log(
    `✅ Updated .env.local with VITE_RAYFIN_API_URL=http://localhost:${port}`
  );
  if (publishableKey) {
    console.log(`✅ Updated .env.local with VITE_RAYFIN_PUBLISHABLE_KEY`);
  }
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

/**
 * Update or create .env.local with the VITE_RAYFIN_API_URL and optionally VITE_RAYFIN_PUBLISHABLE_KEY
 * Preserves all other existing variables
 * @param {string} port - The port number for the API URL (default: '5168')
 * @param {string|null} publishableKey - The publishable key to set (default: 'pk-commonSampleAppPKkey')
 */
function updateEnvLocal(
  port = '5168',
  publishableKey = 'pk-commonSampleAppPKkey'
) {
  let envContent = '';

  // Read existing .env.local if it exists
  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf-8');
  }

  // Update or add the VITE_RAYFIN_API_URL line
  const apiUrlRegex = /^VITE_RAYFIN_API_URL=.*$/m;
  const newApiUrlLine = `VITE_RAYFIN_API_URL=http://localhost:${port}`;

  if (apiUrlRegex.test(envContent)) {
    // Replace existing line
    envContent = envContent.replace(apiUrlRegex, newApiUrlLine);
  } else {
    // Add new line (with newline if content exists)
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += newApiUrlLine + '\n';
  }

  // Update or add the VITE_RAYFIN_PUBLISHABLE_KEY line if provided
  if (publishableKey) {
    const publishableKeyRegex = /^VITE_RAYFIN_PUBLISHABLE_KEY=.*$/m;
    const newPublishableKeyLine = `VITE_RAYFIN_PUBLISHABLE_KEY=${publishableKey}`;

    if (publishableKeyRegex.test(envContent)) {
      // Replace existing line
      envContent = envContent.replace(
        publishableKeyRegex,
        newPublishableKeyLine
      );
    } else {
      // Add new line (with newline if content exists)
      if (envContent && !envContent.endsWith('\n')) {
        envContent += '\n';
      }
      envContent += newPublishableKeyLine + '\n';
    }
  }

  // Write back to .env.local
  fs.writeFileSync(envLocalPath, envContent, 'utf-8');
}
