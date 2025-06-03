import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { TimeEntry } from '@prisma/client';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto';

@Injectable()
export class TimeEntryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTimeEntryDto): Promise<TimeEntry> {
    return this.prisma.timeEntry.create({
      data,
      include: {
        technician: true,
        job: true,
      },
    });
  }

  async update(id: string, data: UpdateTimeEntryDto): Promise<TimeEntry> {
    return this.prisma.timeEntry.update({
      where: { id },
      data,
      include: {
        technician: true,
        job: true,
      },
    });
  }

  async findByTechnician(technicianId: string, date?: string): Promise<TimeEntry[]> {
    const where: any = { technicianId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      where.startTime = {
        gte: startDate,
        lt: endDate,
      };
    }

    return this.prisma.timeEntry.findMany({
      where,
      include: {
        technician: true,
        job: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  async findByJob(jobId: string): Promise<TimeEntry[]> {
    return this.prisma.timeEntry.findMany({
      where: { jobId },
      include: {
        technician: true,
        job: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async startTime(technicianId: string, jobId: string): Promise<TimeEntry> {
    return this.create({
      technicianId,
      jobId,
      startTime: new Date(),
    });
  }

  async endTime(id: string, breakMinutes?: number, notes?: string): Promise<TimeEntry> {
    return this.update(id, {
      endTime: new Date(),
      breakMinutes,
      notes,
    });
  }

  async getTotalHours(technicianId: string, startDate: Date, endDate: Date): Promise<number> {
    const timeEntries = await this.prisma.timeEntry.findMany({
      where: {
        technicianId,
        startTime: {
          gte: startDate,
          lt: endDate,
        },
        endTime: {
          not: null,
        },
      },
    });

    return timeEntries.reduce((total, entry) => {
      if (entry.endTime) {
        const hours = (entry.endTime.getTime() - entry.startTime.getTime()) / (1000 * 60 * 60);
        const breakHours = (entry.breakMinutes || 0) / 60;
        return total + (hours - breakHours);
      }
      return total;
    }, 0);
  }
}
