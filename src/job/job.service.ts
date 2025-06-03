import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Job, JobStatus } from '@prisma/client';
import { CreateJobDto, UpdateJobDto } from './dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Job[]> {
    return this.prisma.job.findMany({
      include: {
        technician: true,
        timeEntries: true,
        assetUsages: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        technician: true,
        timeEntries: true,
        assetUsages: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  async create(data: CreateJobDto): Promise<Job> {
    return this.prisma.job.create({
      data,
      include: {
        technician: true,
      },
    });
  }

  async update(id: string, data: UpdateJobDto): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data,
      include: {
        technician: true,
        timeEntries: true,
        assetUsages: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Job> {
    return this.prisma.job.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: JobStatus): Promise<Job> {
    const updateData: any = { status };
    
    if (status === JobStatus.IN_PROGRESS && !await this.hasActualStart(id)) {
      updateData.actualStart = new Date();
    } else if (status === JobStatus.COMPLETED && !await this.hasActualEnd(id)) {
      updateData.actualEnd = new Date();
    }

    return this.prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        technician: true,
      },
    });
  }

  async addWorkNotes(id: string, notes: string): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data: { workNotes: notes },
    });
  }

  async addAssetUsage(jobId: string, assetId: string, quantityUsed: number = 1): Promise<void> {
    await this.prisma.assetUsage.upsert({
      where: {
        jobId_assetId: {
          jobId,
          assetId,
        },
      },
      create: {
        jobId,
        assetId,
        quantityUsed,
      },
      update: {
        quantityUsed: {
          increment: quantityUsed,
        },
      },
    });
  }

  private async hasActualStart(id: string): Promise<boolean> {
    const job = await this.prisma.job.findUnique({
      where: { id },
      select: { actualStart: true },
    });
    return !!job?.actualStart;
  }

  private async hasActualEnd(id: string): Promise<boolean> {
    const job = await this.prisma.job.findUnique({
      where: { id },
      select: { actualEnd: true },
    });
    return !!job?.actualEnd;
  }
}
