import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { CreateJobDto, UpdateJobDto, UpdateJobStatusDto, AddWorkNotesDto } from './dto';
import { JobStatus, Priority } from '@prisma/client';

describe('JobController', () => {
  let controller: JobController;
  let service: JobService;

  const mockJobService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    addWorkNotes: jest.fn(),
    addAssetUsage: jest.fn(),
    delete: jest.fn(),
  };

  const mockJob = {
    id: '1',
    title: 'Test Job',
    description: 'Test Description',
    customerName: 'Test Customer',
    customerAddress: '123 Test St',
    customerPhone: '+1234567890',
    assignedTechnician: 'tech1',
    scheduledStart: new Date('2025-06-05T09:00:00Z'),
    scheduledEnd: new Date('2025-06-05T17:00:00Z'),
    status: JobStatus.SCHEDULED,
    priority: Priority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: mockJobService,
        },
      ],
    }).compile();

    controller = module.get<JobController>(JobController);
    service = module.get<JobService>(JobService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all jobs', async () => {
      const mockJobs = [mockJob];
      mockJobService.findAll.mockResolvedValue(mockJobs);

      const result = await controller.findAll();

      expect(result).toEqual(mockJobs);
      expect(mockJobService.findAll).toHaveBeenCalledWith();
    });

    it('should return jobs with filters', async () => {
      const mockJobs = [mockJob];
      mockJobService.findAll.mockResolvedValue(mockJobs);

      const result = await controller.findAll('tech1', JobStatus.SCHEDULED);

      expect(result).toEqual(mockJobs);
      expect(mockJobService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      mockJobService.findOne.mockResolvedValue(mockJob);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockJob);
      expect(mockJobService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const createDto: CreateJobDto = {
        title: 'Test Job',
        description: 'Test Description',
        customerName: 'Test Customer',
        customerAddress: '123 Test St',
        customerPhone: '+1234567890',
        assignedTechnician: 'tech1',
        scheduledStart: new Date('2025-06-05T09:00:00Z'),
        scheduledEnd: new Date('2025-06-05T17:00:00Z'),
        priority: Priority.MEDIUM,
      };
      mockJobService.create.mockResolvedValue(mockJob);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockJob);
      expect(mockJobService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const updateDto: UpdateJobDto = {
        title: 'Updated Job',
        description: 'Updated Description',
      };
      const updatedJob = { ...mockJob, ...updateDto };
      mockJobService.update.mockResolvedValue(updatedJob);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedJob);
      expect(mockJobService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('updateStatus', () => {
    it('should update job status', async () => {
      const updateStatusDto: UpdateJobStatusDto = {
        status: JobStatus.IN_PROGRESS,
      };
      const updatedJob = { ...mockJob, status: JobStatus.IN_PROGRESS };
      mockJobService.updateStatus.mockResolvedValue(updatedJob);

      const result = await controller.updateStatus('1', updateStatusDto);

      expect(result).toEqual(updatedJob);
      expect(mockJobService.updateStatus).toHaveBeenCalledWith('1', JobStatus.IN_PROGRESS);
    });
  });

  describe('addWorkNotes', () => {
    it('should add work notes to a job', async () => {
      const addNotesDto: AddWorkNotesDto = {
        notes: 'Work completed successfully',
      };
      const updatedJob = { ...mockJob, workNotes: 'Work completed successfully' };
      mockJobService.addWorkNotes.mockResolvedValue(updatedJob);

      const result = await controller.addWorkNotes('1', addNotesDto);

      expect(result).toEqual(updatedJob);
      expect(mockJobService.addWorkNotes).toHaveBeenCalledWith('1', 'Work completed successfully');
    });
  });

  describe('recordAssetUsage', () => {
    it('should record asset usage for a job with default quantity', async () => {
      mockJobService.addAssetUsage.mockResolvedValue(undefined);

      const result = await controller.recordAssetUsage('1', 'asset1');

      expect(result).toEqual({ message: 'Asset usage recorded successfully' });
      expect(mockJobService.addAssetUsage).toHaveBeenCalledWith('1', 'asset1', 1);
    });

    it('should record asset usage for a job with specified quantity', async () => {
      mockJobService.addAssetUsage.mockResolvedValue(undefined);

      const result = await controller.recordAssetUsage('1', 'asset1', 5);

      expect(result).toEqual({ message: 'Asset usage recorded successfully' });
      expect(mockJobService.addAssetUsage).toHaveBeenCalledWith('1', 'asset1', 5);
    });
  });

  describe('remove', () => {
    it('should delete a job', async () => {
      mockJobService.delete.mockResolvedValue(mockJob);

      const result = await controller.remove('1');

      expect(result).toEqual(mockJob);
      expect(mockJobService.delete).toHaveBeenCalledWith('1');
    });
  });
});
