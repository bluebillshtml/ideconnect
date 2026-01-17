#!/usr/bin/env node

/**
 * Automated setup script for IDEConnect
 * Handles all configuration automatically
 */

import { mkdir, writeFile, readFile, access, copyFile } from 'fs/promises';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = dirname(__dirname);

const CONTEXT_DIR = '.ideconnect';
const SERVER_PATH = join(PROJECT_ROOT, 'server', 'index.js');

// IDE configuration paths
const IDE_CONFIGS = {
  cursor: {
    name: 'Cursor',
    configPath: join(homedir(), '.cursor', 'mcp.json'),
    configDir: join(homedir(), '.cursor'),
    configKey: 'mcpServers',
  },
  claude: {
    name: 'Claude Desktop',
    configPath: process.platform === 'darwin'
      ? join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
      : process.platform === 'win32'
      ? join(process.env.APPDATA || homedir(), 'Claude', 'claude_desktop_config.json')
      : join(homedir(), '.config', 'claude', 'claude_desktop_config.json'),
    configDir: dirname(process.platform === 'darwin'
      ? join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
      : process.platform === 'win32'
      ? join(process.env.APPDATA || homedir(), 'Claude', 'claude_desktop_config.json')
      : join(homedir(), '.config', 'claude', 'claude_desktop_config.json')),
    configKey: 'mcpServers',
  },
};

async function checkNodeVersion() {
  try {
    const version = execSync('node --version', { encoding: 'utf-8' }).trim();
    const major = parseInt(version.replace('v', '').split('.')[0]);
    if (major < 18) {
      throw new Error(`Node.js 18+ required. Found: ${version}`);
    }
    console.log(`✓ Node.js version: ${version}`);
    return true;
  } catch (error) {
    console.error(`❌ Node.js not found or version too old: ${error.message}`);
    return false;
  }
}

async function installDependencies() {
  console.log('\n📦 Installing dependencies...');
  try {
    const serverDir = join(PROJECT_ROOT, 'server');
    process.chdir(serverDir);
    execSync('npm install', { stdio: 'inherit' });
    process.chdir(PROJECT_ROOT);
    console.log('✓ Dependencies installed');
    return true;
  } catch (error) {
    console.error(`❌ Failed to install dependencies: ${error.message}`);
    return false;
  }
}

async function initializeContext() {
  console.log('\n📝 Initializing context files...');
  const contextPath = join(process.cwd(), CONTEXT_DIR);

  try {
    await access(contextPath);
    console.log(`✓ Context directory already exists at ${CONTEXT_DIR}`);
    return true;
  } catch {
    // Directory doesn't exist, create it
  }

  try {
    await mkdir(contextPath, { recursive: true });
    console.log(`✓ Created ${CONTEXT_DIR} directory`);

    // Copy template files
    const templates = ['overview.md', 'architecture.md', 'constraints.md', 'decisions.md', 'roadmap.md'];
    for (const template of templates) {
      const templatePath = join(PROJECT_ROOT, CONTEXT_DIR, template);
      const destPath = join(contextPath, template);
      
      if (existsSync(templatePath)) {
        await copyFile(templatePath, destPath);
        console.log(`✓ Created ${template}`);
      } else {
        // Create minimal template if not found
        await writeFile(destPath, `# ${template.replace('.md', '').charAt(0).toUpperCase() + template.replace('.md', '').slice(1)}\n\n[Add your content here]\n`, 'utf-8');
        console.log(`✓ Created ${template} (template)`);
      }
    }

    console.log(`✓ Context files initialized in ${CONTEXT_DIR}/`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to initialize context: ${error.message}`);
    return false;
  }
}

async function configureIDE(ideName) {
  const ide = IDE_CONFIGS[ideName];
  if (!ide) {
    return false;
  }

  console.log(`\n🔧 Configuring ${ide.name}...`);

  try {
    // Check if config directory exists
    if (!existsSync(ide.configDir)) {
      console.log(`  Creating config directory: ${ide.configDir}`);
      await mkdir(ide.configDir, { recursive: true });
    }

    // Read existing config or create new
    let config = {};
    if (existsSync(ide.configPath)) {
      try {
        const configContent = await readFile(ide.configPath, 'utf-8');
        config = JSON.parse(configContent);
      } catch (error) {
        console.log(`  Warning: Could not parse existing config, creating new one`);
        config = {};
      }
    }

    // Ensure configKey exists
    if (!config[ide.configKey]) {
      config[ide.configKey] = {};
    }

    // Add IDEConnect server
    config[ide.configKey].ideconnect = {
      command: 'node',
      args: [SERVER_PATH],
    };

    // Write config
    await writeFile(ide.configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`✓ ${ide.name} configured at ${ide.configPath}`);
    return true;
  } catch (error) {
    console.error(`  ⚠️  Could not configure ${ide.name}: ${error.message}`);
    console.error(`  You can manually configure it using the path: ${ide.configPath}`);
    return false;
  }
}

async function detectIDEs() {
  const detected = [];
  
  for (const [key, ide] of Object.entries(IDE_CONFIGS)) {
    // Check if IDE config directory exists or if we can write to it
    try {
      if (existsSync(ide.configDir) || key === 'cursor' || key === 'claude') {
        detected.push(key);
      }
    } catch {
      // Skip if we can't check
    }
  }

  return detected;
}

async function runSetup() {
  console.log('🚀 IDEConnect Automated Setup\n');
  console.log('='.repeat(50));

  // Step 1: Check prerequisites
  console.log('\n📋 Checking prerequisites...');
  if (!(await checkNodeVersion())) {
    process.exit(1);
  }

  // Step 2: Install dependencies
  if (!(await installDependencies())) {
    process.exit(1);
  }

  // Step 3: Initialize context
  if (!(await initializeContext())) {
    process.exit(1);
  }

  // Step 4: Detect and configure IDEs
  console.log('\n🔍 Detecting IDEs...');
  const detectedIDEs = await detectIDEs();
  
  if (detectedIDEs.length === 0) {
    console.log('  No IDEs detected. Will configure common IDEs anyway...');
    detectedIDEs.push('cursor', 'claude');
  } else {
    console.log(`  Detected: ${detectedIDEs.map(k => IDE_CONFIGS[k].name).join(', ')}`);
  }

  let configuredCount = 0;
  for (const ideKey of detectedIDEs) {
    if (await configureIDE(ideKey)) {
      configuredCount++;
    }
  }

  // Step 5: Generate file injection
  console.log('\n📄 Generating file injection...');
  try {
    const { spawn } = await import('child_process');
    const injectScript = join(PROJECT_ROOT, 'adapters', 'file-inject', 'inject.js');
    execSync(`node "${injectScript}"`, { stdio: 'inherit', cwd: PROJECT_ROOT });
    console.log('✓ File injection generated');
  } catch (error) {
    console.log(`  ⚠️  File injection failed: ${error.message}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Setup Complete!\n');
  console.log('Summary:');
  console.log(`  ✓ Dependencies installed`);
  console.log(`  ✓ Context files initialized in ${CONTEXT_DIR}/`);
  console.log(`  ✓ ${configuredCount} IDE(s) configured`);
  console.log(`  ✓ File injection ready\n`);
  
  console.log('Next steps:');
  console.log(`  1. Edit files in ${CONTEXT_DIR}/ to document your project`);
  console.log(`  2. Restart your IDE(s) to load IDEConnect`);
  console.log(`  3. Start using context-aware AI assistance!\n`);
  
  if (configuredCount < detectedIDEs.length) {
    console.log('Note: Some IDEs could not be auto-configured.');
    console.log('See docs/IDE_INTEGRATION.md for manual configuration.\n');
  }
}

runSetup().catch((error) => {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
});

