import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { FieldManagementStore } from './store.js';
import { Job, Asset } from './types.js';

export class ToolHandlers {
  constructor(private store: FieldManagementStore) {}

  private getArg(args: any, key: string, required: boolean = true): string {
    const value = args?.[key];
    if (required && (value === undefined || value === null)) {
      throw new Error(`Missing required argument: ${key}`);
    }
    return String(value || '');
  }

  private getOptionalArg(args: any, key: string): string | undefined {
    const value = args?.[key];
    return value !== undefined && value !== null ? String(value) : undefined;
  }

  private getNumberArg(args: any, key: string, required: boolean = true): number {
    const value = args?.[key];
    if (required && (value === undefined || value === null)) {
      throw new Error(`Missing required argument: ${key}`);
    }
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Invalid number for argument: ${key}`);
    }
    return num;
  }

  async handleToolCall(request: CallToolRequest): Promise<any> {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "get_technicians":
          return this.handleGetTechnicians();

        case "get_technician_schedule":
          return this.handleGetTechnicianSchedule(args);

        case "update_job_status":
          return this.handleUpdateJobStatus(args);

        case "add_work_notes":
          return this.handleAddWorkNotes(args);

        case "get_available_assets":
          return this.handleGetAvailableAssets(args);

        case "assign_asset_to_job":
          return this.handleAssignAssetToJob(args);

        case "start_work_timer":
          return this.handleStartWorkTimer(args);

        case "end_work_timer":
          return this.handleEndWorkTimer(args);

        case "get_job_details":
          return this.handleGetJobDetails(args);

        case "update_technician_location":
          return this.handleUpdateTechnicianLocation(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  private handleGetTechnicians() {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(this.store.getTechnicians(), null, 2),
        },
      ],
    };
  }

  private handleGetTechnicianSchedule(args: any) {
    const technicianId = this.getArg(args, 'technicianId');
    const techJobs = this.store.getJobs(technicianId);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(techJobs, null, 2),
        },
      ],
    };
  }

  private handleUpdateJobStatus(args: any) {
    const jobId = this.getArg(args, 'jobId');
    const status = this.getArg(args, 'status') as Job['status'];
    const updated = this.store.updateJobStatus(jobId, status);
    return {
      content: [
        {
          type: "text",
          text: updated ? 
            `Job ${jobId} status updated to ${status}` : 
            `Failed to update job ${jobId}`,
        },
      ],
    };
  }

  private handleAddWorkNotes(args: any) {
    const jobId = this.getArg(args, 'jobId');
    const notes = this.getArg(args, 'notes');
    const notesAdded = this.store.updateJobNotes(jobId, notes);
    return {
      content: [
        {
          type: "text",
          text: notesAdded ? 
            `Work notes added to job ${jobId}` : 
            `Failed to add notes to job ${jobId}`,
        },
      ],
    };
  }

  private handleGetAvailableAssets(args: any) {
    const assetType = this.getOptionalArg(args, 'type') as Asset['type'] | undefined;
    const assignedTo = this.getOptionalArg(args, 'assignedTo');
    const assets = this.store.getAssets(assetType, assignedTo);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(assets, null, 2),
        },
      ],
    };
  }

  private handleAssignAssetToJob(args: any) {
    const jobId = this.getArg(args, 'jobId');
    const assetId = this.getArg(args, 'assetId');
    const assigned = this.store.addAssetToJob(jobId, assetId);
    return {
      content: [
        {
          type: "text",
          text: assigned ? 
            `Asset ${assetId} assigned to job ${jobId}` : 
            `Failed to assign asset to job`,
        },
      ],
    };
  }

  private handleStartWorkTimer(args: any) {
    const technicianId = this.getArg(args, 'technicianId');
    const jobId = this.getArg(args, 'jobId');
    const notes = this.getOptionalArg(args, 'notes');
    const timeEntryId = this.store.startTimeEntry(technicianId, jobId, notes);
    return {
      content: [
        {
          type: "text",
          text: `Work timer started. Time entry ID: ${timeEntryId}`,
        },
      ],
    };
  }

  private handleEndWorkTimer(args: any) {
    const timeEntryId = this.getArg(args, 'timeEntryId');
    const notes = this.getOptionalArg(args, 'notes');
    const ended = this.store.endTimeEntry(timeEntryId, notes);
    return {
      content: [
        {
          type: "text",
          text: ended ? 
            `Work timer ended for entry ${timeEntryId}` : 
            `Failed to end timer for entry ${timeEntryId}`,
        },
      ],
    };
  }

  private handleGetJobDetails(args: any) {
    const jobId = this.getArg(args, 'jobId');
    const job = this.store.getJob(jobId);
    return {
      content: [
        {
          type: "text",
          text: job ? JSON.stringify(job, null, 2) : `Job ${jobId} not found`,
        },
      ],
    };
  }

  private handleUpdateTechnicianLocation(args: any) {
    const technicianId = this.getArg(args, 'technicianId');
    const latitude = this.getNumberArg(args, 'latitude');
    const longitude = this.getNumberArg(args, 'longitude');
    const address = this.getArg(args, 'address');
    const locationUpdated = this.store.updateTechnicianLocation(technicianId, {
      lat: latitude,
      lng: longitude,
      address: address,
    });
    return {
      content: [
        {
          type: "text",
          text: locationUpdated ? 
            `Location updated for technician ${technicianId}` : 
            `Failed to update location for technician ${technicianId}`,
        },
      ],
    };
  }
}
