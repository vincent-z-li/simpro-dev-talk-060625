import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { PrismaService } from '../common/prisma.service';
import { JobStatus, Priority } from '@prisma/client';

describe('JobService', () => {
  let service: JobService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    job: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    assetUsage: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of jobs', async () => {
      const mockJobs = [
        {
          id: '1',
          title: 'HVAC Repair',
          description: 'Fix AC unit',
          customerName: 'John Doe',
          customerAddress: '123 Main St',
          customerPhone: '+1234567890',
          assignedTechnician: 'tech1',
          status: JobStatus.SCHEDULED,
          priority: Priority.MEDIUM,
          technician: {},
          timeEntries: [],
          assetUsages: [],
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);

      const result = await service.findAll();

      expect(result).toEqual(mockJobs);
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      const mockJob = {
        id: '1',
        title: 'HVAC Repair',
        description: 'Fix AC unit',
        status: JobStatus.SCHEDULED,
        technician: {},
        timeEntries: [],
        assetUsages: [],
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.findOne('1');

      expect(result).toEqual(mockJob);
      expect(mockPrismaService.job.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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
    });

    it('should return null if job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const createJobDto = {
        title: 'New Job',
        description: 'Job description',
        customerName: 'Jane Smith',
        customerAddress: '456 Oak St',
        customerPhone: '+1987654321',
        assignedTechnician: 'tech2',
        scheduledStart: new Date('2025-06-05T09:00:00Z'),
        scheduledEnd: new Date('2025-06-05T11:00:00Z'),
        priority: Priority.HIGH,
      };

      const mockCreatedJob = {
        id: '2',
        ...createJobDto,
        status: JobStatus.SCHEDULED,
        actualStart: null,
        actualEnd: null,
        workNotes: null,
        photos: [],
        customerSignature: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.job.create.mockResolvedValue(mockCreatedJob);

      const result = await service.create(createJobDto);

      expect(result).toEqual(mockCreatedJob);
      expect(mockPrismaService.job.create).toHaveBeenCalledWith({
        data: createJobDto,
        include: {
          technician: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const updateData = {
        title: 'Updated Job Title',
        status: JobStatus.IN_PROGRESS,
      };

      const mockUpdatedJob = {
        id: '1',
        title: 'Updated Job Title',
        status: JobStatus.IN_PROGRESS,
        description: 'Fix AC unit',
        customerName: 'John Doe',
        customerAddress: '123 Main St',
        customerPhone: '+1234567890',
        assignedTechnician: 'tech1',
        priority: Priority.MEDIUM,
        scheduledStart: new Date('2025-06-05T09:00:00Z'),
        scheduledEnd: new Date('2025-06-05T11:00:00Z'),
        actualStart: null,
        actualEnd: null,
        workNotes: null,
        photos: [],
        customerSignature: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.job.update.mockResolvedValue(mockUpdatedJob);

      const result = await service.update('1', updateData);

      expect(result).toEqual(mockUpdatedJob);
      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
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
    });
  });

  describe('updateStatus', () => {
    it('should update job status and set actualStart for IN_PROGRESS', async () => {
      const mockJob = {
        id: '1',
        actualStart: null,
        actualEnd: null,
      };
      const mockUpdatedJob = {
        ...mockJob,
        status: JobStatus.IN_PROGRESS,
        actualStart: expect.any(Date),
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaService.job.update.mockResolvedValue(mockUpdatedJob);

      const result = await service.updateStatus('1', JobStatus.IN_PROGRESS);

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: JobStatus.IN_PROGRESS,
          actualStart: expect.any(Date),
        },
        include: {
          technician: true,
        },
      });
    });

    it('should update job status and set actualEnd for COMPLETED', async () => {
      const mockJob = {
        id: '1',
        actualStart: new Date(),
        actualEnd: null,
      };
      const mockUpdatedJob = {
        ...mockJob,
        status: JobStatus.COMPLETED,
        actualEnd: expect.any(Date),
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaService.job.update.mockResolvedValue(mockUpdatedJob);

      const result = await service.updateStatus('1', JobStatus.COMPLETED);

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: JobStatus.COMPLETED,
          actualEnd: expect.any(Date),
        },
        include: {
          technician: true,
        },
      });
    });
  });

  describe('addWorkNotes', () => {
    it('should add work notes to a job', async () => {
      const mockUpdatedJob = {
        id: '1',
        workNotes: 'Completed repairs',
      };

      mockPrismaService.job.update.mockResolvedValue(mockUpdatedJob);

      const result = await service.addWorkNotes('1', 'Completed repairs');

      expect(result).toEqual(mockUpdatedJob);
      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { workNotes: 'Completed repairs' },
      });
    });
  });

  describe('delete', () => {
    it('should delete a job', async () => {
      const mockDeletedJob = {
        id: '1',
        title: 'HVAC Repair',
        status: JobStatus.SCHEDULED,
      };

      mockPrismaService.job.delete.mockResolvedValue(mockDeletedJob);

      const result = await service.delete('1');

      expect(result).toEqual(mockDeletedJob);
      expect(mockPrismaService.job.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('addAssetUsage', () => {
    it('should add asset usage to a job', async () => {
      await service.addAssetUsage('job1', 'asset1', 2);

      expect(mockPrismaService.assetUsage.upsert).toHaveBeenCalledWith({
        where: {
          jobId_assetId: {
            jobId: 'job1',
            assetId: 'asset1',
          },
        },
        create: {
          jobId: 'job1',
          assetId: 'asset1',
          quantityUsed: 2,
        },
        update: {
          quantityUsed: {
            increment: 2,
          },
        },
      });
    });

    it('should default quantity to 1 if not provided', async () => {
      await service.addAssetUsage('job1', 'asset1');

      expect(mockPrismaService.assetUsage.upsert).toHaveBeenCalledWith({
        where: {
          jobId_assetId: {
            jobId: 'job1',
            assetId: 'asset1',
          },
        },
        create: {
          jobId: 'job1',
          assetId: 'asset1',
          quantityUsed: 1,
        },
        update: {
          quantityUsed: {
            increment: 1,
          },
        },
      });
    });
  });
});
