import { readFile } from 'fs/promises';
import { join, dirname, parse } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

/**
 * Get the path to the .ideconnect directory
 * Searches from current directory up to project root
 */
export function findContextDir(startPath = process.cwd()) {
  let current = startPath;
  const root = parse(current).root;
  
  while (current !== root) {
    const contextPath = join(current, '.ideconnect');
    if (existsSync(contextPath)) {
      return contextPath;
    }
    current = dirname(current);
  }
  
  return null;
}

/**
 * Read a context file and return its contents
 */
export async function readContextFile(filename) {
  const contextDir = findContextDir();
  
  if (!contextDir) {
    throw new Error('No .ideconnect directory found. Run "ideconnect init" to initialize.');
  }
  
  const filePath = join(contextDir, filename);
  
  if (!existsSync(filePath)) {
    return null;
  }
  
  try {
    const content = await readFile(filePath, 'utf-8');
    return content.trim();
  } catch (error) {
    throw new Error(`Failed to read ${filename}: ${error.message}`);
  }
}

/**
 * Parse markdown content into structured sections
 */
export function parseMarkdown(content) {
  if (!content) return { raw: '', sections: {} };
  
  const sections = {};
  const lines = content.split('\n');
  let currentSection = 'intro';
  let currentContent = [];
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.substring(2).toLowerCase().replace(/\s+/g, '_');
      currentContent = [];
    } else if (line.startsWith('## ')) {
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.substring(3).toLowerCase().replace(/\s+/g, '_');
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return {
    raw: content,
    sections: sections
  };
}

