#!/usr/bin/env node

/**
 * One-command installer for IDEConnect
 * This is the main entry point for users
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SETUP_SCRIPT = join(__dirname, 'setup.js');

console.log('🎯 IDEConnect - Automated Installation\n');

try {
  // Run the setup script
  execSync(`node "${SETUP_SCRIPT}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Installation failed');
  process.exit(1);
}

