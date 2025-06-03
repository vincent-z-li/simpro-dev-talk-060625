import { Injectable } from '@nestjs/common';
import { TimeEntryService } from '../../time-entry/time-entry.service';
import { MpcHandlerInterface } from './base-handler.interface';
import { getArg, getOptionalArg, createSuccessResponse, createJsonResponse } from './utils';

@Injectable()
export class StartTimeTrackingHandler implements MpcHandlerInterface {
  constructor(private timeEntryService: TimeEntryService) {}

  async handle(args: any): Promise<any> {
    const technicianId = getArg(args, 'technicianId');
    const jobId = getArg(args, 'jobId');

    const timeEntry = await this.timeEntryService.startTime(technicianId, jobId);
    return createSuccessResponse(`Time tracking started for technician ${technicianId} on job ${jobId}. Time entry ID: ${timeEntry.id}`);
  }
}

@Injectable()
export class EndTimeTrackingHandler implements MpcHandlerInterface {
  constructor(private timeEntryService: TimeEntryService) {}

  async handle(args: any): Promise<any> {
    const timeEntryId = getArg(args, 'timeEntryId');
    const breakMinutes = args.breakMinutes ? Number(args.breakMinutes) : undefined;
    const notes = getOptionalArg(args, 'notes');

    await this.timeEntryService.endTime(timeEntryId, breakMinutes, notes);
    return createSuccessResponse(`Time tracking ended for time entry ${timeEntryId}`);
  }
}

@Injectable()
export class GetTimeEntriesHandler implements MpcHandlerInterface {
  constructor(private timeEntryService: TimeEntryService) {}

  async handle(args: any): Promise<any> {
    const technicianId = getOptionalArg(args, 'technicianId');
    const jobId = getOptionalArg(args, 'jobId');
    const date = getOptionalArg(args, 'date');

    let timeEntries;
    if (technicianId) {
      timeEntries = await this.timeEntryService.findByTechnician(technicianId, date);
    } else if (jobId) {
      timeEntries = await this.timeEntryService.findByJob(jobId);
    } else {
      throw new Error('Either technicianId or jobId must be provided');
    }

    return createJsonResponse(timeEntries);
  }
}
