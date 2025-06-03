# simBro MCP Server 

A Model Context Protocol (MCP) server built with Nest, PostgreSQL, and Prisma for technician scheduling, job tracking, and asset management.

*Disclaimer: This is only a demo project for tech talk on showcase the MCP & function calling, not suitable for commercial use.*

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

## Installation
1. `brew services start postgresql@15`
2. Run `setup.sh`. before that, give it access`chmod +x ./setup.sh`

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


