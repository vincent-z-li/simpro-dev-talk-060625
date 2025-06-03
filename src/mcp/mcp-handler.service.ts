import { Injectable } from '@nestjs/common';
import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";

// Services
import { TechnicianService } from '../technician/technician.service';
import { JobService } from '../job/job.service';
import { AssetService } from '../asset/asset.service';
import { TimeEntryService } from '../time-entry/time-entry.service';

// Handlers
import {
  TechnicianHandler,
  TechnicianScheduleHandler,
  UpdateJobStatusHandler,
  AddWorkNotesHandler,
  GetAvailableAssetsHandler,
  AssignAssetHandler,
  RecordAssetUsageHandler,
  StartTimeTrackingHandler,
  EndTimeTrackingHandler,
  GetTimeEntriesHandler,
  CreateJobHandler,
  GetJobsHandler,
} from './handlers';

@Injectable()
export class McpHandlerService {
  private handlers: Map<string, any>;

  constructor(
    private technicianService: TechnicianService,
    private jobService: JobService,
    private assetService: AssetService,
    private timeEntryService: TimeEntryService,
  ) {
    this.handlers = new Map();
    this.initializeHandlers();
  }

  private initializeHandlers() {
    this.handlers.set('get_technicians', new TechnicianHandler(this.technicianService));
    this.handlers.set('get_technician_schedule', new TechnicianScheduleHandler(this.technicianService));
    this.handlers.set('update_job_status', new UpdateJobStatusHandler(this.jobService));
    this.handlers.set('add_work_notes', new AddWorkNotesHandler(this.jobService));
    this.handlers.set('get_available_assets', new GetAvailableAssetsHandler(this.assetService));
    this.handlers.set('assign_asset', new AssignAssetHandler(this.assetService));
    this.handlers.set('record_asset_usage', new RecordAssetUsageHandler(this.jobService));
    this.handlers.set('start_time_tracking', new StartTimeTrackingHandler(this.timeEntryService));
    this.handlers.set('end_time_tracking', new EndTimeTrackingHandler(this.timeEntryService));
    this.handlers.set('get_time_entries', new GetTimeEntriesHandler(this.timeEntryService));
    this.handlers.set('create_job', new CreateJobHandler(this.jobService));
    this.handlers.set('get_jobs', new GetJobsHandler(this.jobService));
  }

  async handleToolCall(request: CallToolRequest): Promise<any> {
    const { name, arguments: args } = request.params;

    try {
      const handler = this.handlers.get(name);
      if (!handler) {
        throw new Error(`Unknown tool: ${name}`);
      }

      return await handler.handle(args);
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
}
