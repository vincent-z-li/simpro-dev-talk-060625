import { Injectable } from '@nestjs/common';
import { JobService } from '../../job/job.service';
import { MpcHandlerInterface } from './base-handler.interface';
import { getArg, getOptionalArg, createSuccessResponse, createJsonResponse } from './utils';
import { JobStatus, Priority } from '@prisma/client';

@Injectable()
export class UpdateJobStatusHandler implements MpcHandlerInterface {
  constructor(private jobService: JobService) {}

  async handle(args: any): Promise<any> {
    const jobId = getArg(args, 'jobId');
    const status = getArg(args, 'status') as JobStatus;

    await this.jobService.updateStatus(jobId, status);
    return createSuccessResponse(`Job ${jobId} status updated to ${status}`);
  }
}

@Injectable()
export class AddWorkNotesHandler implements MpcHandlerInterface {
  constructor(private jobService: JobService) {}

  async handle(args: any): Promise<any> {
    const jobId = getArg(args, 'jobId');
    const notes = getArg(args, 'notes');

    await this.jobService.addWorkNotes(jobId, notes);
    return createSuccessResponse(`Work notes added to job ${jobId}`);
  }
}

@Injectable()
export class GetJobsHandler implements MpcHandlerInterface {
  constructor(private jobService: JobService) {}

  async handle(args: any): Promise<any> {
    const jobs = await this.jobService.findAll();
    return createJsonResponse(jobs);
  }
}

@Injectable()
export class CreateJobHandler implements MpcHandlerInterface {
  constructor(private jobService: JobService) {}

  async handle(args: any): Promise<any> {
    const jobData = {
      title: getArg(args, 'title'),
      description: getArg(args, 'description'),
      customerName: getArg(args, 'customerName'),
      customerAddress: getArg(args, 'customerAddress'),
      customerPhone: getArg(args, 'customerPhone'),
      assignedTechnician: getArg(args, 'assignedTechnician'),
      scheduledStart: new Date(getArg(args, 'scheduledStart')),
      scheduledEnd: new Date(getArg(args, 'scheduledEnd')),
      priority: (getOptionalArg(args, 'priority') as Priority) || Priority.MEDIUM,
    };

    const job = await this.jobService.create(jobData);
    return createSuccessResponse(`Job created successfully with ID: ${job.id}`);
  }
}

@Injectable()
export class RecordAssetUsageHandler implements MpcHandlerInterface {
  constructor(private jobService: JobService) {}

  async handle(args: any): Promise<any> {
    const jobId = getArg(args, 'jobId');
    const assetId = getArg(args, 'assetId');
    const quantity = args.quantity ? Number(args.quantity) : 1;

    await this.jobService.addAssetUsage(jobId, assetId, quantity);
    return createSuccessResponse(`Recorded usage of asset ${assetId} (quantity: ${quantity}) for job ${jobId}`);
  }
}
