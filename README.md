# simBro MCP Server 

A Model Context Protocol (MCP) server built with Nest, PostgreSQL, and Prisma for technician scheduling, job tracking, and asset management.

*Disclaimer: This is only a demo project for tech talk on showcase the MCP & function calling, not suitable for commercial use.*

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

## Installation
1. `brew services start postgresql@15`
2. Run `setup.sh`. before that, give it access`chmod +x ./setup.sh`, fix any error that occurs
3. `npm run mcp:start`
4. Connect this MCP with your local agent, similar to this [Guide](https://www.notion.so/Update-Jira-Confluence-with-Copilot-agent-mode-by-connecting-their-MCP-2026aa72858e805391accb123ff90009?source=copy_link)
4. MCP inspector is on port: `http://127.0.0.1:6274`
5. Ask agents to do some the sample workflows defined below


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


## Sample Work flows
### 1 Morning Dispatch Workflow
1. Show me all available technicians and their skills
2. What's John Smith's schedule for today?
3. Get the details for the AC repair job - what's the priority and customer info?
4. John is heading to the job site now - update his location to 789 Business Ave, New York
5. Start the work timer for John on the AC repair job

### 2 Technician is on-site and working
1. Update job job001 status to in_progress
2. Add work notes: 'Diagnosed refrigerant leak in evaporator coil. Capacitor also failing. Ordering replacement parts.'
3. Show me available assets of type 'equipment'
4. Assign the refrigerant recovery unit to job job001
5. Add more work notes: 'Parts arrived. Replacing capacitor and sealing leak. System testing in progress.'
6. Update job status to completed

### 3 Emergency Response
1. Show me all available technicians
2. Which technicians have electrical skills?
3. What's Sarah's current location and status?
4. Get available electrical tools and equipment
5. Start a work timer for an emergency electrical job

### 4 Asset Management
1. Show me all assets assigned to tech001
2. What tools are currently available in the warehouse?
3. Get all assets of type 'part' - what inventory do we have?
4. Assign asset001 to job002 for the electrical inspection
5. Show me which assets are being used on active jobs

### 5 End-of-Day Reporting
1. Show me all jobs with status 'completed' today
2. What work notes were added to the AC repair job?
3. Get the time entries for tech001 - how long did jobs take?
4. Update all technician statuses to 'offline' for end of day
5. Show me tomorrow's scheduled jobs

