import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateTimeEntryDto {
  @ApiProperty({ description: 'ID of the technician' })
  @IsUUID()
  technicianId: string;

  @ApiProperty({ description: 'ID of the job' })
  @IsUUID()
  jobId: string;

  @ApiProperty({ description: 'Start time', example: '2025-06-03T09:15:00Z' })
  @IsDateString()
  startTime: Date;

  @ApiPropertyOptional({ description: 'End time', example: '2025-06-03T12:15:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @ApiPropertyOptional({ description: 'Break time in minutes', example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  breakMinutes?: number;

  @ApiPropertyOptional({ description: 'Work notes', example: 'Started diagnostic on AC unit' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTimeEntryDto {
  @ApiPropertyOptional({ description: 'End time', example: '2025-06-03T12:15:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @ApiPropertyOptional({ description: 'Break time in minutes', example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  breakMinutes?: number;

  @ApiPropertyOptional({ description: 'Work notes', example: 'Completed AC unit repair' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class StartTimeTrackingDto {
  @ApiProperty({ description: 'ID of the technician' })
  @IsUUID()
  technicianId: string;

  @ApiProperty({ description: 'ID of the job' })
  @IsUUID()
  jobId: string;
}

export class EndTimeTrackingDto {
  @ApiPropertyOptional({ description: 'Break time in minutes', example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  breakMinutes?: number;

  @ApiPropertyOptional({ description: 'Work notes', example: 'Completed AC unit repair' })
  @IsOptional()
  @IsString()
  notes?: string;
}
