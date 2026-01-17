import { readContextFile, parseMarkdown } from './utils.js';

/**
 * Get full project context
 */
export async function getProjectContext() {
  try {
    const overview = await readContextFile('overview.md');
    const architecture = await readContextFile('architecture.md');
    const constraints = await readContextFile('constraints.md');
    const decisions = await readContextFile('decisions.md');
    const roadmap = await readContextFile('roadmap.md');
    
    return {
      overview: overview || null,
      architecture: architecture || null,
      constraints: constraints || null,
      decisions: decisions || null,
      roadmap: roadmap || null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to retrieve project context: ${error.message}`);
  }
}

/**
 * Get project overview
 */
export async function getOverview() {
  const content = await readContextFile('overview.md');
  if (!content) {
    return { error: 'overview.md not found. Run "ideconnect init" to create it.' };
  }
  return {
    content: content,
    parsed: parseMarkdown(content),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get architecture documentation
 */
export async function getArchitecture() {
  const content = await readContextFile('architecture.md');
  if (!content) {
    return { error: 'architecture.md not found.' };
  }
  return {
    content: content,
    parsed: parseMarkdown(content),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get project constraints
 */
export async function getConstraints() {
  const content = await readContextFile('constraints.md');
  if (!content) {
    return { error: 'constraints.md not found.' };
  }
  return {
    content: content,
    parsed: parseMarkdown(content),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get recorded decisions
 */
export async function getDecisions() {
  const content = await readContextFile('decisions.md');
  if (!content) {
    return { error: 'decisions.md not found.' };
  }
  return {
    content: content,
    parsed: parseMarkdown(content),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get roadmap (optional)
 */
export async function getRoadmap() {
  const content = await readContextFile('roadmap.md');
  if (!content) {
    return { error: 'roadmap.md not found (optional file).' };
  }
  return {
    content: content,
    parsed: parseMarkdown(content),
    timestamp: new Date().toISOString()
  };
}

