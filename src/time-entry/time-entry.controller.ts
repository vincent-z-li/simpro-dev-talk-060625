import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TimeEntryService } from './time-entry.service';
import { CreateTimeEntryDto, UpdateTimeEntryDto, StartTimeTrackingDto, EndTimeTrackingDto } from './dto';

@ApiTags('Time Entries')
@Controller('time-entries')
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Get()
  @ApiOperation({ summary: 'Get time entries' })
  @ApiResponse({ status: 200, description: 'Returns time entries with technician and job info' })
  @ApiQuery({ name: 'technicianId', required: false, description: 'Filter by technician ID' })
  @ApiQuery({ name: 'jobId', required: false, description: 'Filter by job ID' })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by date (YYYY-MM-DD format)' })
  async findAll(
    @Query('technicianId') technicianId?: string,
    @Query('jobId') jobId?: string,
    @Query('date') date?: string,
  ) {
    if (technicianId) {
      return this.timeEntryService.findByTechnician(technicianId, date);
    }
    if (jobId) {
      return this.timeEntryService.findByJob(jobId);
    }
    // If no filters, you might want to implement a general findAll method
    throw new Error('Please provide either technicianId or jobId parameter');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new time entry' })
  @ApiResponse({ status: 201, description: 'Time entry created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body(ValidationPipe) createTimeEntryDto: CreateTimeEntryDto) {
    return this.timeEntryService.create(createTimeEntryDto);
  }

  @Post('start')
  @ApiOperation({ summary: 'Start time tracking for a technician on a job' })
  @ApiResponse({ status: 201, description: 'Time tracking started successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async startTimeTracking(@Body(ValidationPipe) startTimeDto: StartTimeTrackingDto) {
    return this.timeEntryService.startTime(startTimeDto.technicianId, startTimeDto.jobId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({ status: 200, description: 'Time entry updated successfully' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTimeEntryDto: UpdateTimeEntryDto,
  ) {
    return this.timeEntryService.update(id, updateTimeEntryDto);
  }

  @Put(':id/end')
  @ApiOperation({ summary: 'End time tracking for a time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({ status: 200, description: 'Time tracking ended successfully' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  async endTimeTracking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) endTimeDto: EndTimeTrackingDto,
  ) {
    return this.timeEntryService.endTime(id, endTimeDto.breakMinutes, endTimeDto.notes);
  }

  @Get('technician/:technicianId/total-hours')
  @ApiOperation({ summary: 'Get total hours worked by technician in date range' })
  @ApiParam({ name: 'technicianId', description: 'Technician ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD format)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD format)' })
  @ApiResponse({ status: 200, description: 'Returns total hours worked' })
  async getTotalHours(
    @Param('technicianId', ParseUUIDPipe) technicianId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const totalHours = await this.timeEntryService.getTotalHours(
      technicianId,
      new Date(startDate),
      new Date(endDate),
    );
    return { technicianId, startDate, endDate, totalHours };
  }
}
