#!/usr/bin/env node

import { mkdir, writeFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONTEXT_DIR = '.ideconnect';

const templates = {
  'overview.md': `# Project Overview

## Purpose

[Describe the project's primary purpose and what problem it solves]

## Scope

[Define what is included and excluded from this project]

## Goals

[List the main objectives and success criteria]

## Key Stakeholders

[Identify important people, teams, or organizations involved]

## Current Status

[Brief description of where the project stands today]
`,

  'architecture.md': `# Architecture

## System Design

[High-level system architecture, component diagram, or description]

## Components

[Breakdown of major components and their responsibilities]

## Data Flow

[How data moves through the system]

## Patterns & Conventions

[Architectural patterns, coding conventions, design principles used]

## Technology Stack

[Languages, frameworks, libraries, tools used]

## Dependencies

[External dependencies and their purposes]
`,

  'constraints.md': `# Constraints

## Technical Constraints

[Hardware, software, performance, scalability limits]

## Business Constraints

[Budget, timeline, regulatory, compliance requirements]

## Resource Constraints

[Team size, expertise, time, infrastructure limitations]

## Design Constraints

[Platform requirements, compatibility, integration limitations]

## Operational Constraints

[Deployment, maintenance, monitoring requirements]
`,

  'decisions.md': `# Architectural Decisions

## Decision Log

[Record decisions in reverse chronological order (newest first)]

### [Date] - [Decision Title]

**Context**: [What situation required a decision]

**Decision**: [What was decided]

**Rationale**: [Why this decision was made]

**Alternatives Considered**: [Other options that were evaluated]

**Consequences**: [Expected impact of this decision]

---

[Add more decisions above this line]
`,

  'roadmap.md': `# Roadmap

## Current Phase

[What is being worked on now]

## Upcoming Milestones

[Planned milestones and target dates]

## Future Considerations

[Ideas, features, or improvements for later]

## Known Work Items

[Specific tasks or issues to address]
`,
};

async function init() {
  const cwd = process.cwd();
  const contextPath = join(cwd, CONTEXT_DIR);

  try {
    // Check if already exists
    await access(contextPath);
    console.log(`✓ ${CONTEXT_DIR} directory already exists`);
    console.log('  Skipping initialization. Delete the directory to reinitialize.');
    return;
  } catch {
    // Directory doesn't exist, create it
  }

  try {
    // Create directory
    await mkdir(contextPath, { recursive: true });
    console.log(`✓ Created ${CONTEXT_DIR} directory`);

    // Create template files
    for (const [filename, content] of Object.entries(templates)) {
      const filePath = join(contextPath, filename);
      await writeFile(filePath, content, 'utf-8');
      console.log(`✓ Created ${filename}`);
    }

    console.log('\n✓ IDEConnect initialized successfully!');
    console.log(`\nNext steps:`);
    console.log(`  1. Edit files in ${CONTEXT_DIR}/ to document your project`);
    console.log(`  2. Configure your IDE to use the MCP server`);
    console.log(`  3. See docs/SETUP.md for IDE integration instructions`);
  } catch (error) {
    console.error(`Error initializing IDEConnect: ${error.message}`);
    process.exit(1);
  }
}

init();

