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
import { JobService } from './job.service';
import { CreateJobDto, UpdateJobDto, UpdateJobStatusDto, AddWorkNotesDto } from './dto';
import { JobStatus } from '@prisma/client';

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Returns all jobs with technician and time entries' })
  @ApiQuery({ name: 'technicianId', required: false, description: 'Filter by technician ID' })
  @ApiQuery({ name: 'status', enum: JobStatus, required: false, description: 'Filter by status' })
  async findAll(
    @Query('technicianId') technicianId?: string,
    @Query('status') status?: JobStatus,
  ) {
    // For now, return all jobs. In the future, you could implement filtering here
    return this.jobService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Returns job details with technician, time entries, and asset usages' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body(ValidationPipe) createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update job' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateJobDto: UpdateJobDto,
  ) {
    return this.jobService.update(id, updateJobDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update job status' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job status updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateJobStatusDto,
  ) {
    return this.jobService.updateStatus(id, updateStatusDto.status);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add work notes to job' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Work notes added successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async addWorkNotes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) addNotesDto: AddWorkNotesDto,
  ) {
    return this.jobService.addWorkNotes(id, addNotesDto.notes);
  }

  @Post(':id/assets/:assetId')
  @ApiOperation({ summary: 'Record asset usage for job' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiParam({ name: 'assetId', description: 'Asset ID' })
  @ApiQuery({ name: 'quantity', required: false, description: 'Quantity used (default: 1)' })
  @ApiResponse({ status: 200, description: 'Asset usage recorded successfully' })
  @ApiResponse({ status: 404, description: 'Job or asset not found' })
  async recordAssetUsage(
    @Param('id', ParseUUIDPipe) jobId: string,
    @Param('assetId', ParseUUIDPipe) assetId: string,
    @Query('quantity') quantity?: number,
  ) {
    await this.jobService.addAssetUsage(jobId, assetId, quantity || 1);
    return { message: 'Asset usage recorded successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete job' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobService.delete(id);
  }
}
