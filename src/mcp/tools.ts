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
          enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
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
          enum: ["TOOL", "EQUIPMENT", "PART", "MATERIAL"],
          description: "Filter by asset type (optional)",
        },
      },
    },
  },
  {
    name: "assign_asset",
    description: "Assign an asset to a technician",
    inputSchema: {
      type: "object",
      properties: {
        assetId: {
          type: "string",
          description: "ID of the asset",
        },
        technicianId: {
          type: "string",
          description: "ID of the technician",
        },
      },
      required: ["assetId", "technicianId"],
    },
  },
  {
    name: "record_asset_usage",
    description: "Record asset usage for a job",
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
        quantity: {
          type: "number",
          description: "Quantity used (default: 1)",
        },
      },
      required: ["jobId", "assetId"],
    },
  },
  {
    name: "start_time_tracking",
    description: "Start time tracking for a technician on a job",
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
      },
      required: ["technicianId", "jobId"],
    },
  },
  {
    name: "end_time_tracking",
    description: "End time tracking for a time entry",
    inputSchema: {
      type: "object",
      properties: {
        timeEntryId: {
          type: "string",
          description: "ID of the time entry",
        },
        breakMinutes: {
          type: "number",
          description: "Break time in minutes (optional)",
        },
        notes: {
          type: "string",
          description: "Additional notes (optional)",
        },
      },
      required: ["timeEntryId"],
    },
  },
  {
    name: "get_time_entries",
    description: "Get time entries for a technician or job",
    inputSchema: {
      type: "object",
      properties: {
        technicianId: {
          type: "string",
          description: "ID of the technician (optional)",
        },
        jobId: {
          type: "string",
          description: "ID of the job (optional)",
        },
        date: {
          type: "string",
          description: "Date in YYYY-MM-DD format (optional)",
        },
      },
    },
  },
  {
    name: "create_job",
    description: "Create a new job",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Job title",
        },
        description: {
          type: "string",
          description: "Job description",
        },
        customerName: {
          type: "string",
          description: "Customer name",
        },
        customerAddress: {
          type: "string",
          description: "Customer address",
        },
        customerPhone: {
          type: "string",
          description: "Customer phone",
        },
        assignedTechnician: {
          type: "string",
          description: "ID of assigned technician",
        },
        scheduledStart: {
          type: "string",
          description: "Scheduled start time (ISO format)",
        },
        scheduledEnd: {
          type: "string",
          description: "Scheduled end time (ISO format)",
        },
        priority: {
          type: "string",
          enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
          description: "Job priority (optional, defaults to MEDIUM)",
        },
      },
      required: ["title", "description", "customerName", "customerAddress", "customerPhone", "assignedTechnician", "scheduledStart", "scheduledEnd"],
    },
  },
  {
    name: "get_jobs",
    description: "Get all jobs or jobs for a specific technician",
    inputSchema: {
      type: "object",
      properties: {
        technicianId: {
          type: "string",
          description: "ID of the technician (optional)",
        },
        status: {
          type: "string",
          enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
          description: "Filter by status (optional)",
        },
      },
    },
  },
];
