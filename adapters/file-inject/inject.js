#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * File-based context injection for IDEs without MCP support
 * Generates a single JSON file that IDEs can read directly
 */

async function injectContext() {
  const contextDir = '.ideconnect';
  const outputFile = '.ideconnect-context.json';

  if (!existsSync(contextDir)) {
    console.error(`Error: ${contextDir} directory not found. Run "ideconnect init" first.`);
    process.exit(1);
  }

  const files = {
    overview: 'overview.md',
    architecture: 'architecture.md',
    constraints: 'constraints.md',
    decisions: 'decisions.md',
    roadmap: 'roadmap.md',
  };

  const context = {
    timestamp: new Date().toISOString(),
    sources: {},
  };

  for (const [key, filename] of Object.entries(files)) {
    const filePath = join(contextDir, filename);
    try {
      if (existsSync(filePath)) {
        const content = await readFile(filePath, 'utf-8');
        context.sources[key] = content.trim();
      } else {
        context.sources[key] = null;
      }
    } catch (error) {
      console.error(`Warning: Failed to read ${filename}: ${error.message}`);
      context.sources[key] = null;
    }
  }

  await writeFile(outputFile, JSON.stringify(context, null, 2), 'utf-8');
  console.log(`✓ Generated ${outputFile}`);
  console.log('  IDEs can read this file to get project context');
}

injectContext().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

