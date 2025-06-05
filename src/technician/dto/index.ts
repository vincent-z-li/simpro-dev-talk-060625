import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, IsEnum, IsNumber, ArrayNotEmpty } from 'class-validator';
import { TechnicianStatus } from '@prisma/client';

export class CreateTechnicianDto {
  @ApiProperty({ description: 'Technician name', example: 'John Smith' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address', example: 'john.smith@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+1-555-0101' })
  @IsString()
  phone: string;

  @ApiProperty({ 
    description: 'Array of skills', 
    example: ['HVAC', 'Electrical', 'Plumbing'],
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @ApiPropertyOptional({ 
    description: 'Technician status',
    enum: TechnicianStatus,
    default: TechnicianStatus.AVAILABLE
  })
  @IsOptional()
  @IsEnum(TechnicianStatus)
  status?: TechnicianStatus;

  @ApiPropertyOptional({ description: 'Latitude coordinate', example: 40.7128 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate', example: -74.0060 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ description: 'Address', example: '123 Main St, New York, NY' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateTechnicianDto {
  @ApiPropertyOptional({ description: 'Technician name', example: 'John Smith' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'john.smith@company.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1-555-0101' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Array of skills', 
    example: ['HVAC', 'Electrical', 'Plumbing'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ 
    description: 'Technician status',
    enum: TechnicianStatus
  })
  @IsOptional()
  @IsEnum(TechnicianStatus)
  status?: TechnicianStatus;

  @ApiPropertyOptional({ description: 'Latitude coordinate', example: 40.7128 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate', example: -74.0060 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ description: 'Address', example: '123 Main St, New York, NY' })
  @IsOptional()
  @IsString()
  address?: string;
}
