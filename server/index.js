#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  getProjectContext,
  getOverview,
  getArchitecture,
  getConstraints,
  getDecisions,
  getRoadmap,
} from './tools/context.js';

class IDEConnectServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ideconnect',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.transport = new StdioServerTransport();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_project_context',
          description: 'Get complete project context including overview, architecture, constraints, decisions, and roadmap',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_overview',
          description: 'Get project overview including purpose, scope, and goals',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_architecture',
          description: 'Get project architecture documentation including system design and patterns',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_constraints',
          description: 'Get project constraints including technical, business, and resource limits',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_decisions',
          description: 'Get recorded architectural decisions with rationale',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_roadmap',
          description: 'Get project roadmap and future plans (optional)',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_project_context': {
            const context = await getProjectContext();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(context, null, 2),
                },
              ],
            };
          }

          case 'get_overview': {
            const overview = await getOverview();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(overview, null, 2),
                },
              ],
            };
          }

          case 'get_architecture': {
            const architecture = await getArchitecture();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(architecture, null, 2),
                },
              ],
            };
          }

          case 'get_constraints': {
            const constraints = await getConstraints();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(constraints, null, 2),
                },
              ],
            };
          }

          case 'get_decisions': {
            const decisions = await getDecisions();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(decisions, null, 2),
                },
              ],
            };
          }

          case 'get_roadmap': {
            const roadmap = await getRoadmap();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(roadmap, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error.message,
                tool: name,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    await this.server.connect(this.transport);
    console.error('IDEConnect server running on stdio');
  }
}

const server = new IDEConnectServer();
server.run().catch(console.error);

