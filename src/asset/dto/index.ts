import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsUUID, IsDateString, Min } from 'class-validator';
import { AssetType, AssetCondition } from '@prisma/client';

export class CreateAssetDto {
  @ApiProperty({ description: 'Asset name', example: 'HVAC Multimeter' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Asset type',
    enum: AssetType,
    example: AssetType.TOOL
  })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty({ description: 'Asset description', example: 'Digital multimeter for HVAC diagnostics' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quantity available', example: 5 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Storage location', example: 'Tool Room A' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ description: 'ID of assigned technician' })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({ 
    description: 'Asset condition',
    enum: AssetCondition,
    default: AssetCondition.GOOD
  })
  @IsOptional()
  @IsEnum(AssetCondition)
  condition?: AssetCondition;

  @ApiPropertyOptional({ description: 'Last maintenance date', example: '2025-05-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  lastMaintenance?: Date;
}

export class UpdateAssetDto {
  @ApiPropertyOptional({ description: 'Asset name', example: 'HVAC Multimeter' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Asset type',
    enum: AssetType
  })
  @IsOptional()
  @IsEnum(AssetType)
  type?: AssetType;

  @ApiPropertyOptional({ description: 'Asset description', example: 'Digital multimeter for HVAC diagnostics' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Quantity available', example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Storage location', example: 'Tool Room A' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'ID of assigned technician' })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({ 
    description: 'Asset condition',
    enum: AssetCondition
  })
  @IsOptional()
  @IsEnum(AssetCondition)
  condition?: AssetCondition;

  @ApiPropertyOptional({ description: 'Last maintenance date', example: '2025-05-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  lastMaintenance?: Date;
}

export class AssignAssetDto {
  @ApiProperty({ description: 'ID of technician to assign asset to' })
  @IsUUID()
  technicianId: string;
}
