export class CreateTimeEntryDto {
  technicianId: string;
  jobId: string;
  startTime: Date;
  endTime?: Date;
  breakMinutes?: number;
  notes?: string;
}

export class UpdateTimeEntryDto {
  endTime?: Date;
  breakMinutes?: number;
  notes?: string;
}
