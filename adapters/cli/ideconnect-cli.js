#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * CLI wrapper for IDEConnect
 * Allows IDEs without native MCP support to query context via command line
 */

const commands = {
  'get-project-context': 'get_project_context',
  'get-overview': 'get_overview',
  'get-architecture': 'get_architecture',
  'get-constraints': 'get_constraints',
  'get-decisions': 'get_decisions',
  'get-roadmap': 'get_roadmap',
};

async function callMCPTool(toolName) {
  return new Promise((resolve, reject) => {
    const serverPath = join(__dirname, '../../server/index.js');
    const nodeProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Construct MCP request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: {},
      },
    };

    let output = '';
    let errorOutput = '';

    nodeProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    nodeProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    nodeProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`MCP server exited with code ${code}: ${errorOutput}`));
        return;
      }

      try {
        const lines = output.trim().split('\n');
        const responseLine = lines.find((line) => {
          try {
            const parsed = JSON.parse(line);
            return parsed.id === 1;
          } catch {
            return false;
          }
        });

        if (responseLine) {
          const response = JSON.parse(responseLine);
          if (response.error) {
            reject(new Error(response.error.message || 'MCP error'));
          } else {
            resolve(response.result);
          }
        } else {
          reject(new Error('No valid response from MCP server'));
        }
      } catch (error) {
        reject(new Error(`Failed to parse response: ${error.message}`));
      }
    });

    // Send request
    const requestStr = JSON.stringify(request) + '\n';
    nodeProcess.stdin.write(requestStr);
    nodeProcess.stdin.end();
  });
}

// CLI interface
const command = process.argv[2];

if (!command || !commands[command]) {
  console.error('Usage: ideconnect-cli <command>');
  console.error('\nAvailable commands:');
  Object.keys(commands).forEach((cmd) => {
    console.error(`  ${cmd}`);
  });
  process.exit(1);
}

const toolName = commands[command];

callMCPTool(toolName)
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });

