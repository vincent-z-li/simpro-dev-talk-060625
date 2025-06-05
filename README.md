# simBro Server (MCP+RESTful) 

A dual-mode application built with NestJS, PostgreSQL, and Prisma for technician scheduling, job tracking, and asset management. It can run as either or at same time:
- **MCP Server**: Model Context Protocol server for AI agent integration (stdio)
- **RESTful API Server**: Traditional REST API with Swagger documentation

*Disclaimer: This is only a demo project for tech talk on showcase the MCP & function calling, not suitable for commercial use.*

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

## Installation & Setup
1. `brew services start postgresql@15`
2. Run `setup.sh`. before that, give it access`chmod +x ./setup.sh`, fix any error that occurs

## Running the Application

### MCP Server 
```bash
npm run mcp:inspect
```
- MCP inspector available at: `http://127.0.0.1:6274`
- Click "Connect", and can test all the tool works as expected without connecting to local agent.
- To connect this MCP with your local agent, similar to this [Guide](https://www.notion.so/Update-Jira-Confluence-with-Copilot-agent-mode-by-connecting-their-MCP-2026aa72858e805391accb123ff90009?source=copy_link)

### RESTful API Server 
For traditional REST API usage:
```bash
npm run start:api        # Production mode
npm run start:api:dev    # Development mode with hot reload
```
- API available at: `http://localhost:3000`
- Swagger documentation at: `http://localhost:3000/api`

## Available MCP Tools

### Technician Management
- `get_technicians` - Get all technicians with status and location
- `get_technician_schedule` - Get scheduled jobs for a technician

### Job Management
- `create_job` - Create a new job
- `get_jobs` - Get all jobs or filter by technician/status
- `update_job_status` - Update job status
- `add_work_notes` - Add work notes to a job

### Asset Management
- `get_available_assets` - Get available assets, optionally filtered by type
- `assign_asset` - Assign an asset to a technician
- `record_asset_usage` - Record asset usage for a job

### Time Tracking
- `start_time_tracking` - Start time tracking for a technician on a job
- `end_time_tracking` - End time tracking
- `get_time_entries` - Get time entries for technician or job

## RESTful API Endpoints

When running in API mode, the following REST endpoints are available:

### Technicians
- `GET /technicians` - Get all technicians
- `GET /technicians/:id/schedule` - Get technician schedule

### Jobs
- `POST /jobs` - Create a new job
- `GET /jobs` - Get all jobs (with optional filters)
- `PATCH /jobs/:id/status` - Update job status
- `POST /jobs/:id/notes` - Add work notes to a job

### Assets
- `GET /assets` - Get available assets
- `POST /assets/:id/assign` - Assign asset to technician
- `POST /assets/usage` - Record asset usage

### Time Entries
- `POST /time-entries/start` - Start time tracking
- `POST /time-entries/:id/end` - End time tracking
- `GET /time-entries` - Get time entries

Visit `/api` endpoint for complete Swagger documentation when running the API server.


