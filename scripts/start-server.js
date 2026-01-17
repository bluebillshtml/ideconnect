#!/usr/bin/env node

/**
 * Start IDEConnect MCP server as a daemon/service
 * For production hosting scenarios
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = dirname(__dirname);
const SERVER_PATH = join(PROJECT_ROOT, 'server', 'index.js');

if (!existsSync(SERVER_PATH)) {
  console.error('❌ Server not found. Run setup first.');
  process.exit(1);
}

console.log('🚀 Starting IDEConnect MCP Server...');
console.log(`   Server: ${SERVER_PATH}`);
console.log('   Press Ctrl+C to stop\n');

const server = spawn('node', [SERVER_PATH], {
  stdio: 'inherit',
  cwd: PROJECT_ROOT,
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\n❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

