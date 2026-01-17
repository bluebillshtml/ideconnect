# IDEConnect

A free, self-hosted Model Context Protocol (MCP) server that provides shared, persistent project context across multiple AI IDEs.

## What Is IDEConnect?

IDEConnect creates a "shared project brain" so that all IDEs and AI agents understand the same project scope, architecture, constraints, and decisions **without relying on chat history**.

**Key Concept: Project Context vs Chat History**

IDEConnect provides project context (what your project is), not chat history (what you've discussed). Each IDE maintains separate conversations, but all IDEs understand your project the same way.

Example: You chat in Cursor about authentication → Chat stays in Cursor. You open Kiro → Kiro understands your project architecture (from IDEConnect) but does NOT see your Cursor chat.

## What IDEConnect Offers

**1. Consistent Project Understanding**

All your AI IDEs (Cursor, Kiro, Antigravity, Claude Desktop) understand:
- Project Overview - Purpose, scope, goals, stakeholders
- Architecture - System design, components, data flow, patterns
- Constraints - Technical limits, business rules, resource constraints
- Decisions - Architectural decisions with rationale
- Roadmap - Future plans and milestones

**2. Zero Manual Configuration**

One command sets up everything - auto-detects IDEs, configures them automatically, creates templates, and generates file injection.

**3. File-Based Storage**

Deterministic, version-controlled, human-readable markdown files. No database needed - simple, reliable, portable.

**4. IDE-Agnostic**

Works with Cursor (native MCP), Claude Desktop (native MCP), Kiro (file injection), Antigravity (CLI adapter), and any IDE via adapters.

**5. Free & Self-Hosted**

No external services, no paid APIs, no cloud dependencies - 100% local and private.

## Installation

**Prerequisites:** Node.js 18 or higher, npm or yarn

**Quick Install - One command does everything:**

```bash
npm run install
```

This automatically:
1. Checks Node.js version
2. Installs all dependencies
3. Creates `.ideconnect/` directory
4. Initializes context file templates
5. Auto-detects and configures your IDEs
6. Generates file injection for non-MCP IDEs

**After Installation:**

1. Edit context files in `.ideconnect/` to document your project:
   - `overview.md` - Project purpose, scope, goals
   - `architecture.md` - System design, components
   - `constraints.md` - Technical and business limits
   - `decisions.md` - Architectural decisions
   - `roadmap.md` - Future plans (optional)

2. Restart your IDE to load IDEConnect

3. Start using context-aware AI assistance!

**Manual Installation (If Needed):**

If automated setup doesn't work:

```bash
# 1. Install dependencies
cd server
npm install

# 2. Initialize context
cd ..
node scripts/init.js

# 3. Configure IDE manually (see IDE Configuration below)
```

## IDE Configuration

The setup script automatically configures Cursor and Claude Desktop. If automatic configuration fails, manually add to your IDE's config:

**Cursor** - Edit `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ideconnect": {
      "command": "node",
      "args": ["/absolute/path/to/ideconnect/server/index.js"]
    }
  }
}
```

**Claude Desktop** - Edit your platform's config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ideconnect": {
      "command": "node",
      "args": ["/absolute/path/to/ideconnect/server/index.js"]
    }
  }
}
```

**Non-MCP IDEs (Kiro, Antigravity, etc.)**

Option 1: File Injection - IDEConnect generates `.ideconnect-context.json` automatically. Your IDE can read this file.

Option 2: CLI Adapter:
```bash
node adapters/cli/ideconnect-cli.js get-overview
```

## How It Works

**Architecture:** AI IDEs → MCP Protocol → IDEConnect Server → .ideconnect/ Files

1. IDE starts and calls MCP tools
2. IDEConnect Server reads markdown files from `.ideconnect/`
3. Returns structured JSON with project context
4. AI uses context for all responses

**Context Files:** IDEConnect reads from `.ideconnect/` directory:
- `overview.md` - Project overview
- `architecture.md` - System architecture
- `constraints.md` - Project constraints
- `decisions.md` - Architectural decisions
- `roadmap.md` - Roadmap (optional)

**Available MCP Tools:**
- `get_project_context` - Get complete project context
- `get_overview` - Get project overview
- `get_architecture` - Get architecture documentation
- `get_constraints` - Get project constraints
- `get_decisions` - Get recorded decisions
- `get_roadmap` - Get roadmap (optional)

## Common Issues & Troubleshooting

**Setup Fails** - `npm run install` fails
- Check Node.js version: `node --version` (must be 18+)
- Ensure write permissions in project directory
- Try running with administrator/sudo if needed
- Check if `.ideconnect/` directory already exists (delete and retry)

**IDE Not Detected** - Setup says "No IDEs detected"
- This is okay - setup will still attempt to configure common IDEs
- Manually configure your IDE (see IDE Configuration above)
- Verify IDE config file location exists

**IDE Not Connecting** - IDE doesn't connect to IDEConnect
- Verify MCP server path in IDE config matches actual location (use absolute path)
- Check server dependencies: `cd server && npm install`
- Test server manually: `node server/index.js` (should start without errors)
- Restart IDE after configuration changes
- Check IDE logs for connection errors

**Context Files Not Found** - MCP tools return "file not found"
- Verify `.ideconnect/` directory exists: `ls .ideconnect`
- Re-initialize context: `node scripts/init.js`
- Check you're in project root when running commands
- Verify file permissions - ensure files are readable

**Server Won't Start** - MCP server crashes or won't start
- Verify dependencies installed: `cd server && npm install`
- Check Node.js version: `node --version` (must be 18+)
- Test server directly: `node server/index.js` (look for error messages)
- Check file paths in server code match your system

**IDE Shows Old Context** - Changes to context files not reflected
- No restart needed - changes are immediate
- Verify file was saved correctly
- Check file encoding - should be UTF-8
- Restart IDE if still not working

**File Injection Not Working** - `.ideconnect-context.json` not generated
- Run manually: `node adapters/file-inject/inject.js`
- Check `.ideconnect/` directory exists
- Verify write permissions in project directory

**Multiple Projects** - How to use IDEConnect with multiple projects?
- Each project has its own `.ideconnect/` directory
- IDEConnect searches up directory tree to find context
- Works automatically - no configuration needed per project

**Team Collaboration** - How to share context with team?
- Commit `.ideconnect/` to git (recommended)
- Team members pull updates
- Context files are version controlled
- No sync needed - file-based, deterministic

**Privacy Concerns** - Worried about storing project context
- All local - no external services
- File-based - you control everything
- Version control - use `.gitignore` if needed
- No chat history - only project context stored

## Verification

Check that everything is working:

```bash
npm run verify
```

This checks:
- ✅ Context files exist
- ✅ IDE configurations are correct
- ✅ MCP server is ready
- ✅ File injection is valid

## Project Structure

```
ideconnect/
├── server/              # MCP server implementation
│   ├── index.js         # Main server
│   ├── tools/           # Context tools
│   └── package.json     # Dependencies
├── .ideconnect/          # Context storage (created by setup)
│   ├── overview.md
│   ├── architecture.md
│   ├── constraints.md
│   ├── decisions.md
│   └── roadmap.md
├── adapters/             # IDE adapters
│   ├── cli/             # CLI wrapper
│   └── file-inject/     # File injection
├── scripts/              # Setup scripts
│   ├── setup.js         # Automated setup
│   ├── init.js          # Initialize context
│   └── verify.js        # Verification
└── README.md            # This file
```

## Requirements

- **Node.js**: 18 or higher
- **npm**: Any recent version
- **Operating System**: Windows, macOS, or Linux

## License

MIT

## Contributing

This is a self-hosted tool. Fork, modify, and use as needed for your projects.

## Support

For issues:
1. Check "Common Issues" section above
2. Verify installation with `npm run verify`
3. Check IDE logs for error messages
4. Ensure Node.js 18+ is installed
