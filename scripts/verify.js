#!/usr/bin/env node

/**
 * Verify IDEConnect installation and configuration
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = dirname(__dirname);

const CONTEXT_DIR = '.ideconnect';
const SERVER_PATH = join(PROJECT_ROOT, 'server', 'index.js');

const IDE_CONFIGS = {
  cursor: {
    name: 'Cursor',
    configPath: join(homedir(), '.cursor', 'mcp.json'),
  },
  claude: {
    name: 'Claude Desktop',
    configPath: process.platform === 'darwin'
      ? join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
      : process.platform === 'win32'
      ? join(process.env.APPDATA || homedir(), 'Claude', 'claude_desktop_config.json')
      : join(homedir(), '.config', 'claude', 'claude_desktop_config.json'),
  },
};

function verifyContextFiles() {
  console.log('📝 Verifying context files...');
  const contextPath = join(process.cwd(), CONTEXT_DIR);
  
  if (!existsSync(contextPath)) {
    console.log('  ❌ Context directory not found');
    return false;
  }

  const requiredFiles = ['overview.md', 'architecture.md', 'constraints.md', 'decisions.md', 'roadmap.md'];
  let allExist = true;

  for (const file of requiredFiles) {
    const filePath = join(contextPath, file);
    if (existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} missing`);
      allExist = false;
    }
  }

  return allExist;
}

function verifyIDEs() {
  console.log('\n🔧 Verifying IDE configurations...');
  let configured = 0;

  for (const [key, ide] of Object.entries(IDE_CONFIGS)) {
    if (existsSync(ide.configPath)) {
      try {
        const config = JSON.parse(readFileSync(ide.configPath, 'utf-8'));
        if (config.mcpServers && config.mcpServers.ideconnect) {
          console.log(`  ✅ ${ide.name} configured`);
          configured++;
        } else {
          console.log(`  ⚠️  ${ide.name} config exists but IDEConnect not configured`);
        }
      } catch (error) {
        console.log(`  ⚠️  ${ide.name} config file exists but could not be parsed`);
      }
    } else {
      console.log(`  ⚠️  ${ide.name} not configured (config file not found)`);
    }
  }

  return configured;
}

function verifyServer() {
  console.log('\n🚀 Verifying MCP server...');
  
  if (!existsSync(SERVER_PATH)) {
    console.log('  ❌ Server file not found');
    return false;
  }

  // Check if dependencies are installed
  const serverDir = join(PROJECT_ROOT, 'server');
  const nodeModules = join(serverDir, 'node_modules');
  
  if (!existsSync(nodeModules)) {
    console.log('  ⚠️  Dependencies not installed (run: npm run install)');
    return false;
  }

  // Check server
  console.log('  ✅ Server file exists');
  console.log('  ✅ Dependencies installed');
  return true;
}

function verifyFileInjection() {
  console.log('\n📄 Verifying file injection...');
  const injectionFile = join(process.cwd(), '.ideconnect-context.json');
  
  if (existsSync(injectionFile)) {
    try {
      const content = JSON.parse(readFileSync(injectionFile, 'utf-8'));
      if (content.sources && content.timestamp) {
        console.log('  ✅ File injection exists and valid');
        console.log(`     Timestamp: ${content.timestamp}`);
        console.log(`     Sources: ${Object.keys(content.sources).length} files`);
        return true;
      }
    } catch (error) {
      console.log('  ⚠️  File injection exists but invalid JSON');
      return false;
    }
  } else {
    console.log('  ⚠️  File injection not found (run: npm run inject)');
    return false;
  }
}

function runVerification() {
  console.log('🔍 IDEConnect Verification\n');
  console.log('='.repeat(50));

  const results = {
    context: verifyContextFiles(),
    ides: verifyIDEs(),
    server: verifyServer(),
    injection: verifyFileInjection(),
  };

  console.log('\n' + '='.repeat(50));
  console.log('📊 Verification Summary\n');
  
  console.log(`Context Files: ${results.context ? '✅' : '❌'}`);
  console.log(`IDE Configurations: ${results.ides} configured`);
  console.log(`MCP Server: ${results.server ? '✅' : '❌'}`);
  console.log(`File Injection: ${results.injection ? '✅' : '❌'}`);

  const allGood = results.context && results.server && results.injection && results.ides > 0;
  
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('✅ All systems operational!');
    console.log('\nNext steps:');
    console.log('  1. Restart your IDE(s)');
    console.log('  2. Edit .ideconnect/ files to document your project');
    console.log('  3. Start using IDEConnect!');
  } else {
    console.log('⚠️  Some issues detected. Run: npm run install');
  }
}

try {
  runVerification();
} catch (error) {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
}

