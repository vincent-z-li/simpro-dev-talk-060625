import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Technician, TechnicianStatus } from '@prisma/client';
import { CreateTechnicianDto, UpdateTechnicianDto } from './dto';

@Injectable()
export class TechnicianService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Technician[]> {
    return this.prisma.technician.findMany({
      include: {
        jobs: true,
        assets: true,
      },
    });
  }

  async findOne(id: string): Promise<Technician | null> {
    return this.prisma.technician.findUnique({
      where: { id },
      include: {
        jobs: true,
        assets: true,
        timeEntries: true,
      },
    });
  }

  async create(data: CreateTechnicianDto): Promise<Technician> {
    return this.prisma.technician.create({
      data,
    });
  }

  async update(id: string, data: UpdateTechnicianDto): Promise<Technician> {
    return this.prisma.technician.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Technician> {
    return this.prisma.technician.delete({
      where: { id },
    });
  }

  async findByStatus(status: TechnicianStatus): Promise<Technician[]> {
    return this.prisma.technician.findMany({
      where: { status },
      include: {
        jobs: true,
      },
    });
  }

  async getSchedule(technicianId: string, date?: string): Promise<any[]> {
    const startDate = date ? new Date(date) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    return this.prisma.job.findMany({
      where: {
        assignedTechnician: technicianId,
        scheduledStart: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        scheduledStart: 'asc',
      },
    });
  }
}
