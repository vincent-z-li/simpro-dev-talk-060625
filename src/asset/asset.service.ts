import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Asset, AssetType } from '@prisma/client';
import { CreateAssetDto, UpdateAssetDto } from './dto';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      include: {
        technician: true,
      },
    });
  }

  async findOne(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        technician: true,
        assetUsages: {
          include: {
            job: true,
          },
        },
      },
    });
  }

  async create(data: CreateAssetDto): Promise<Asset> {
    return this.prisma.asset.create({
      data,
    });
  }

  async update(id: string, data: UpdateAssetDto): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Asset> {
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async findAvailableAssets(type?: AssetType): Promise<Asset[]> {
    const where: any = {
      quantity: {
        gt: 0,
      },
    };

    if (type) {
      where.type = type;
    }

    return this.prisma.asset.findMany({
      where,
      include: {
        technician: true,
      },
    });
  }

  async assignToTechnician(id: string, technicianId: string): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data: { assignedTo: technicianId },
    });
  }

  async unassignFromTechnician(id: string): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data: { assignedTo: null },
    });
  }

  async updateQuantity(id: string, quantity: number): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data: { quantity },
    });
  }
}
