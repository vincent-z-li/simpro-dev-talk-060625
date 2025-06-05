import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsUUID, IsArray } from 'class-validator';
import { JobStatus, Priority } from '@prisma/client';

export class CreateJobDto {
  @ApiProperty({ description: 'Job title', example: 'AC Unit Repair' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Job description', example: 'Customer reports AC not cooling properly' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Customer name', example: 'ABC Corporation' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer address', example: '789 Business Ave, New York, NY 10001' })
  @IsString()
  customerAddress: string;

  @ApiProperty({ description: 'Customer phone', example: '+1-555-0201' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ description: 'ID of assigned technician' })
  @IsUUID()
  assignedTechnician: string;

  @ApiProperty({ description: 'Scheduled start time', example: '2025-06-03T09:00:00Z' })
  @IsDateString()
  scheduledStart: Date;

  @ApiProperty({ description: 'Scheduled end time', example: '2025-06-03T12:00:00Z' })
  @IsDateString()
  scheduledEnd: Date;

  @ApiPropertyOptional({ 
    description: 'Job priority',
    enum: Priority,
    default: Priority.MEDIUM
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}

export class UpdateJobDto {
  @ApiPropertyOptional({ description: 'Job title', example: 'AC Unit Repair' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Job description', example: 'Customer reports AC not cooling properly' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Customer name', example: 'ABC Corporation' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Customer address', example: '789 Business Ave, New York, NY 10001' })
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiPropertyOptional({ description: 'Customer phone', example: '+1-555-0201' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'ID of assigned technician' })
  @IsOptional()
  @IsUUID()
  assignedTechnician?: string;

  @ApiPropertyOptional({ description: 'Scheduled start time', example: '2025-06-03T09:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduledStart?: Date;

  @ApiPropertyOptional({ description: 'Scheduled end time', example: '2025-06-03T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduledEnd?: Date;

  @ApiPropertyOptional({ description: 'Actual start time', example: '2025-06-03T09:15:00Z' })
  @IsOptional()
  @IsDateString()
  actualStart?: Date;

  @ApiPropertyOptional({ description: 'Actual end time', example: '2025-06-03T12:30:00Z' })
  @IsOptional()
  @IsDateString()
  actualEnd?: Date;

  @ApiPropertyOptional({ 
    description: 'Job status',
    enum: JobStatus
  })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @ApiPropertyOptional({ 
    description: 'Job priority',
    enum: Priority
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Work notes', example: 'Found refrigerant leak in evaporator coil' })
  @IsOptional()
  @IsString()
  workNotes?: string;

  @ApiPropertyOptional({ 
    description: 'Array of photo URLs',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({ description: 'Customer signature data' })
  @IsOptional()
  @IsString()
  customerSignature?: string;
}

export class UpdateJobStatusDto {
  @ApiProperty({ 
    description: 'New job status',
    enum: JobStatus
  })
  @IsEnum(JobStatus)
  status: JobStatus;
}

export class AddWorkNotesDto {
  @ApiProperty({ description: 'Work notes to add', example: 'Completed diagnostics, ordering parts' })
  @IsString()
  notes: string;
}
