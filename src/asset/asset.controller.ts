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
import { AssetService } from './asset.service';
import { CreateAssetDto, UpdateAssetDto, AssignAssetDto } from './dto';
import { AssetType } from '@prisma/client';

@ApiTags('Assets')
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({ status: 200, description: 'Returns all assets with assigned technician info' })
  @ApiQuery({ name: 'type', enum: AssetType, required: false, description: 'Filter by asset type' })
  @ApiQuery({ name: 'available', type: 'boolean', required: false, description: 'Filter by availability (quantity > 0)' })
  async findAll(
    @Query('type') type?: AssetType,
    @Query('available') available?: boolean,
  ) {
    if (available === true) {
      return this.assetService.findAvailableAssets(type);
    }
    return this.assetService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Returns asset details with technician and usage history' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body(ValidationPipe) createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update asset' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateAssetDto: UpdateAssetDto,
  ) {
    return this.assetService.update(id, updateAssetDto);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign asset to technician' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset assigned successfully' })
  @ApiResponse({ status: 404, description: 'Asset or technician not found' })
  async assignToTechnician(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) assignAssetDto: AssignAssetDto,
  ) {
    return this.assetService.assignToTechnician(id, assignAssetDto.technicianId);
  }

  @Post(':id/unassign')
  @ApiOperation({ summary: 'Unassign asset from technician' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset unassigned successfully' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async unassignFromTechnician(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetService.unassignFromTechnician(id);
  }

  @Put(':id/quantity')
  @ApiOperation({ summary: 'Update asset quantity' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiQuery({ name: 'quantity', description: 'New quantity', type: 'number' })
  @ApiResponse({ status: 200, description: 'Asset quantity updated successfully' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async updateQuantity(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('quantity') quantity: number,
  ) {
    return this.assetService.updateQuantity(id, Number(quantity));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete asset' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetService.delete(id);
  }
}
