import { JobStatus, Priority } from '@prisma/client';

export class CreateJobDto {
  title: string;
  description: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  assignedTechnician: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  priority?: Priority;
}

export class UpdateJobDto {
  title?: string;
  description?: string;
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  assignedTechnician?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status?: JobStatus;
  priority?: Priority;
  workNotes?: string;
  photos?: string[];
  customerSignature?: string;
}
