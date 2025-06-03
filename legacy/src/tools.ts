import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "get_technicians",
    description: "Get list of all technicians with their current status and location",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_technician_schedule",
    description: "Get scheduled jobs for a specific technician",
    inputSchema: {
      type: "object",
      properties: {
        technicianId: {
          type: "string",
          description: "ID of the technician",
        },
        date: {
          type: "string",
          description: "Date in YYYY-MM-DD format (optional, defaults to today)",
        },
      },
      required: ["technicianId"],
    },
  },
  {
    name: "update_job_status",
    description: "Update the status of a job (scheduled, in_progress, completed, cancelled)",
    inputSchema: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
          description: "ID of the job",
        },
        status: {
          type: "string",
          enum: ["scheduled", "in_progress", "completed", "cancelled"],
          description: "New status for the job",
        },
      },
      required: ["jobId", "status"],
    },
  },
  {
    name: "add_work_notes",
    description: "Add work notes to a job",
    inputSchema: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
          description: "ID of the job",
        },
        notes: {
          type: "string",
          description: "Work notes to add",
        },
      },
      required: ["jobId", "notes"],
    },
  },
  {
    name: "get_available_assets",
    description: "Get list of available assets, optionally filtered by type",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["tool", "equipment", "part", "material"],
          description: "Filter by asset type (optional)",
        },
        assignedTo: {
          type: "string",
          description: "Filter by technician assignment (optional)",
        },
      },
    },
  },
  {
    name: "assign_asset_to_job",
    description: "Assign an asset to a specific job",
    inputSchema: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
          description: "ID of the job",
        },
        assetId: {
          type: "string",
          description: "ID of the asset",
        },
      },
      required: ["jobId", "assetId"],
    },
  },
  {
    name: "start_work_timer",
    description: "Start time tracking for a job",
    inputSchema: {
      type: "object",
      properties: {
        technicianId: {
          type: "string",
          description: "ID of the technician",
        },
        jobId: {
          type: "string",
          description: "ID of the job",
        },
        notes: {
          type: "string",
          description: "Optional notes when starting work",
        },
      },
      required: ["technicianId", "jobId"],
    },
  },
  {
    name: "end_work_timer",
    description: "End time tracking for a job",
    inputSchema: {
      type: "object",
      properties: {
        timeEntryId: {
          type: "string",
          description: "ID of the time entry to end",
        },
        notes: {
          type: "string",
          description: "Optional completion notes",
        },
      },
      required: ["timeEntryId"],
    },
  },
  {
    name: "get_job_details",
    description: "Get detailed information about a specific job",
    inputSchema: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
          description: "ID of the job",
        },
      },
      required: ["jobId"],
    },
  },
  {
    name: "update_technician_location",
    description: "Update technician's current location",
    inputSchema: {
      type: "object",
      properties: {
        technicianId: {
          type: "string",
          description: "ID of the technician",
        },
        latitude: {
          type: "number",
          description: "Latitude coordinate",
        },
        longitude: {
          type: "number",
          description: "Longitude coordinate",
        },
        address: {
          type: "string",
          description: "Human-readable address",
        },
      },
      required: ["technicianId", "latitude", "longitude", "address"],
    },
  },
];
