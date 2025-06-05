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
import { TechnicianService } from './technician.service';
import { CreateTechnicianDto, UpdateTechnicianDto } from './dto';
import { TechnicianStatus } from '@prisma/client';

@ApiTags('Technicians')
@Controller('technicians')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @Get()
  @ApiOperation({ summary: 'Get all technicians' })
  @ApiResponse({ status: 200, description: 'Returns all technicians with their jobs and assets' })
  @ApiQuery({ name: 'status', enum: TechnicianStatus, required: false, description: 'Filter by status' })
  async findAll(@Query('status') status?: TechnicianStatus) {
    if (status) {
      return this.technicianService.findByStatus(status);
    }
    return this.technicianService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get technician by ID' })
  @ApiParam({ name: 'id', description: 'Technician ID' })
  @ApiResponse({ status: 200, description: 'Returns technician details' })
  @ApiResponse({ status: 404, description: 'Technician not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.technicianService.findOne(id);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get technician schedule' })
  @ApiParam({ name: 'id', description: 'Technician ID' })
  @ApiQuery({ name: 'date', required: false, description: 'Date in YYYY-MM-DD format (optional, defaults to today)' })
  @ApiResponse({ status: 200, description: 'Returns scheduled jobs for the technician' })
  async getSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('date') date?: string,
  ) {
    return this.technicianService.getSchedule(id, date);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new technician' })
  @ApiResponse({ status: 201, description: 'Technician created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body(ValidationPipe) createTechnicianDto: CreateTechnicianDto) {
    return this.technicianService.create(createTechnicianDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update technician' })
  @ApiParam({ name: 'id', description: 'Technician ID' })
  @ApiResponse({ status: 200, description: 'Technician updated successfully' })
  @ApiResponse({ status: 404, description: 'Technician not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.technicianService.update(id, updateTechnicianDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete technician' })
  @ApiParam({ name: 'id', description: 'Technician ID' })
  @ApiResponse({ status: 200, description: 'Technician deleted successfully' })
  @ApiResponse({ status: 404, description: 'Technician not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.technicianService.delete(id);
  }
}
