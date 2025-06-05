import { Test, TestingModule } from '@nestjs/testing';
import { TimeEntryService } from './time-entry.service';
import { PrismaService } from '../common/prisma.service';

describe('TimeEntryService', () => {
  let service: TimeEntryService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    timeEntry: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeEntryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TimeEntryService>(TimeEntryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new time entry', async () => {
      const createTimeEntryDto = {
        technicianId: 'tech1',
        jobId: 'job1',
        startTime: new Date('2025-06-05T09:00:00Z'),
        notes: 'Started work',
      };

      const mockCreatedTimeEntry = {
        id: '1',
        ...createTimeEntryDto,
        endTime: null,
        breakMinutes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        technician: {},
        job: {},
      };

      mockPrismaService.timeEntry.create.mockResolvedValue(mockCreatedTimeEntry);

      const result = await service.create(createTimeEntryDto);

      expect(result).toEqual(mockCreatedTimeEntry);
      expect(mockPrismaService.timeEntry.create).toHaveBeenCalledWith({
        data: createTimeEntryDto,
        include: {
          technician: true,
          job: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a time entry', async () => {
      const updateData = {
        endTime: new Date('2025-06-05T11:00:00Z'),
        breakMinutes: 15,
        notes: 'Completed work',
      };

      const mockUpdatedTimeEntry = {
        id: '1',
        technicianId: 'tech1',
        jobId: 'job1',
        startTime: new Date('2025-06-05T09:00:00Z'),
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
        technician: {},
        job: {},
      };

      mockPrismaService.timeEntry.update.mockResolvedValue(mockUpdatedTimeEntry);

      const result = await service.update('1', updateData);

      expect(result).toEqual(mockUpdatedTimeEntry);
      expect(mockPrismaService.timeEntry.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        include: {
          technician: true,
          job: true,
        },
      });
    });
  });

  describe('findByTechnician', () => {
    it('should return time entries for a technician without date filter', async () => {
      const mockTimeEntries = [
        {
          id: '1',
          technicianId: 'tech1',
          jobId: 'job1',
          startTime: new Date('2025-06-05T09:00:00Z'),
          endTime: new Date('2025-06-05T11:00:00Z'),
          technician: {},
          job: {},
        },
      ];

      mockPrismaService.timeEntry.findMany.mockResolvedValue(mockTimeEntries);

      const result = await service.findByTechnician('tech1');

      expect(result).toEqual(mockTimeEntries);
      expect(mockPrismaService.timeEntry.findMany).toHaveBeenCalledWith({
        where: { technicianId: 'tech1' },
        include: {
          technician: true,
          job: true,
        },
        orderBy: {
          startTime: 'desc',
        },
      });
    });

    it('should return time entries for a technician with date filter', async () => {
      const mockTimeEntries = [
        {
          id: '1',
          technicianId: 'tech1',
          jobId: 'job1',
          startTime: new Date('2025-06-05T09:00:00Z'),
          endTime: new Date('2025-06-05T11:00:00Z'),
          technician: {},
          job: {},
        },
      ];

      mockPrismaService.timeEntry.findMany.mockResolvedValue(mockTimeEntries);

      const result = await service.findByTechnician('tech1', '2025-06-05');

      expect(result).toEqual(mockTimeEntries);
      expect(mockPrismaService.timeEntry.findMany).toHaveBeenCalledWith({
        where: {
          technicianId: 'tech1',
          startTime: {
            gte: new Date('2025-06-05'),
            lt: new Date('2025-06-06'),
          },
        },
        include: {
          technician: true,
          job: true,
        },
        orderBy: {
          startTime: 'desc',
        },
      });
    });
  });

  describe('findByJob', () => {
    it('should return time entries for a job', async () => {
      const mockTimeEntries = [
        {
          id: '1',
          technicianId: 'tech1',
          jobId: 'job1',
          startTime: new Date('2025-06-05T09:00:00Z'),
          endTime: new Date('2025-06-05T11:00:00Z'),
          technician: {},
          job: {},
        },
        {
          id: '2',
          technicianId: 'tech2',
          jobId: 'job1',
          startTime: new Date('2025-06-05T11:00:00Z'),
          endTime: new Date('2025-06-05T13:00:00Z'),
          technician: {},
          job: {},
        },
      ];

      mockPrismaService.timeEntry.findMany.mockResolvedValue(mockTimeEntries);

      const result = await service.findByJob('job1');

      expect(result).toEqual(mockTimeEntries);
      expect(mockPrismaService.timeEntry.findMany).toHaveBeenCalledWith({
        where: { jobId: 'job1' },
        include: {
          technician: true,
          job: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      });
    });
  });

  describe('startTime', () => {
    it('should start time tracking', async () => {
      const mockTimeEntry = {
        id: '1',
        technicianId: 'tech1',
        jobId: 'job1',
        startTime: expect.any(Date),
        endTime: null,
        breakMinutes: null,
        notes: null,
        technician: {},
        job: {},
      };

      mockPrismaService.timeEntry.create.mockResolvedValue(mockTimeEntry);

      const result = await service.startTime('tech1', 'job1');

      expect(result).toEqual(mockTimeEntry);
      expect(mockPrismaService.timeEntry.create).toHaveBeenCalledWith({
        data: {
          technicianId: 'tech1',
          jobId: 'job1',
          startTime: expect.any(Date),
        },
        include: {
          technician: true,
          job: true,
        },
      });
    });
  });

  describe('endTime', () => {
    it('should end time tracking', async () => {
      const mockTimeEntry = {
        id: '1',
        technicianId: 'tech1',
        jobId: 'job1',
        startTime: new Date('2025-06-05T09:00:00Z'),
        endTime: expect.any(Date),
        breakMinutes: 15,
        notes: 'Work completed',
        technician: {},
        job: {},
      };

      mockPrismaService.timeEntry.update.mockResolvedValue(mockTimeEntry);

      const result = await service.endTime('1', 15, 'Work completed');

      expect(result).toEqual(mockTimeEntry);
      expect(mockPrismaService.timeEntry.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          endTime: expect.any(Date),
          breakMinutes: 15,
          notes: 'Work completed',
        },
        include: {
          technician: true,
          job: true,
        },
      });
    });

    it('should end time tracking without break minutes and notes', async () => {
      const mockTimeEntry = {
        id: '1',
        technicianId: 'tech1',
        jobId: 'job1',
        startTime: new Date('2025-06-05T09:00:00Z'),
        endTime: expect.any(Date),
        breakMinutes: undefined,
        notes: undefined,
        technician: {},
        job: {},
      };

      mockPrismaService.timeEntry.update.mockResolvedValue(mockTimeEntry);

      const result = await service.endTime('1');

      expect(result).toEqual(mockTimeEntry);
      expect(mockPrismaService.timeEntry.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          endTime: expect.any(Date),
          breakMinutes: undefined,
          notes: undefined,
        },
        include: {
          technician: true,
          job: true,
        },
      });
    });
  });

  describe('getTotalHours', () => {
    it('should calculate total hours worked by technician in date range', async () => {
      const mockTimeEntries = [
        {
          id: '1',
          startTime: new Date('2025-06-05T09:00:00Z'),
          endTime: new Date('2025-06-05T11:00:00Z'), // 2 hours
          breakMinutes: 15, // 0.25 hours break
        },
        {
          id: '2',
          startTime: new Date('2025-06-05T13:00:00Z'),
          endTime: new Date('2025-06-05T17:00:00Z'), // 4 hours
          breakMinutes: 30, // 0.5 hours break
        },
        {
          id: '3',
          startTime: new Date('2025-06-05T18:00:00Z'),
          endTime: null, // Should be ignored
          breakMinutes: null,
        },
      ];

      mockPrismaService.timeEntry.findMany.mockResolvedValue(mockTimeEntries);

      const startDate = new Date('2025-06-05');
      const endDate = new Date('2025-06-06');
      const result = await service.getTotalHours('tech1', startDate, endDate);

      // Total: (2 - 0.25) + (4 - 0.5) = 1.75 + 3.5 = 5.25 hours
      expect(result).toEqual(5.25);
      expect(mockPrismaService.timeEntry.findMany).toHaveBeenCalledWith({
        where: {
          technicianId: 'tech1',
          startTime: {
            gte: startDate,
            lt: endDate,
          },
          endTime: {
            not: null,
          },
        },
      });
    });

    it('should return 0 if no completed time entries found', async () => {
      mockPrismaService.timeEntry.findMany.mockResolvedValue([]);

      const startDate = new Date('2025-06-05');
      const endDate = new Date('2025-06-06');
      const result = await service.getTotalHours('tech1', startDate, endDate);

      expect(result).toEqual(0);
    });
  });
});
