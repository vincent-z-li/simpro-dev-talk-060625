import { Test, TestingModule } from '@nestjs/testing';
import { 
  UpdateJobStatusHandler, 
  AddWorkNotesHandler, 
  GetJobsHandler, 
  CreateJobHandler, 
  RecordAssetUsageHandler 
} from './job-handlers';
import { JobService } from '../../job/job.service';
import { JobStatus, Priority } from '@prisma/client';

describe('JobHandlers', () => {
  let jobService: JobService;
  let updateJobStatusHandler: UpdateJobStatusHandler;
  let addWorkNotesHandler: AddWorkNotesHandler;
  let getJobsHandler: GetJobsHandler;
  let createJobHandler: CreateJobHandler;
  let recordAssetUsageHandler: RecordAssetUsageHandler;

  const mockJobService = {
    findAll: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    addWorkNotes: jest.fn(),
    addAssetUsage: jest.fn(),
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
      providers: [
        UpdateJobStatusHandler,
        AddWorkNotesHandler,
        GetJobsHandler,
        CreateJobHandler,
        RecordAssetUsageHandler,
        {
          provide: JobService,
          useValue: mockJobService,
        },
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
    updateJobStatusHandler = module.get<UpdateJobStatusHandler>(UpdateJobStatusHandler);
    addWorkNotesHandler = module.get<AddWorkNotesHandler>(AddWorkNotesHandler);
    getJobsHandler = module.get<GetJobsHandler>(GetJobsHandler);
    createJobHandler = module.get<CreateJobHandler>(CreateJobHandler);
    recordAssetUsageHandler = module.get<RecordAssetUsageHandler>(RecordAssetUsageHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UpdateJobStatusHandler', () => {
    it('should be defined', () => {
      expect(updateJobStatusHandler).toBeDefined();
    });

    it('should update job status successfully', async () => {
      const updatedJob = { ...mockJob, status: JobStatus.IN_PROGRESS };
      mockJobService.updateStatus.mockResolvedValue(updatedJob);

      const args = { jobId: 'job1', status: 'IN_PROGRESS' };
      const result = await updateJobStatusHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Job job1 status updated to IN_PROGRESS",
          },
        ],
      });
      expect(mockJobService.updateStatus).toHaveBeenCalledWith('job1', 'IN_PROGRESS');
    });

    it('should throw error when jobId is missing', async () => {
      const args = { status: 'IN_PROGRESS' };

      await expect(updateJobStatusHandler.handle(args)).rejects.toThrow('Missing required argument: jobId');
      expect(mockJobService.updateStatus).not.toHaveBeenCalled();
    });

    it('should throw error when status is missing', async () => {
      const args = { jobId: 'job1' };

      await expect(updateJobStatusHandler.handle(args)).rejects.toThrow('Missing required argument: status');
      expect(mockJobService.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('AddWorkNotesHandler', () => {
    it('should be defined', () => {
      expect(addWorkNotesHandler).toBeDefined();
    });

    it('should add work notes successfully', async () => {
      const updatedJob = { ...mockJob, workNotes: 'Work completed' };
      mockJobService.addWorkNotes.mockResolvedValue(updatedJob);

      const args = { jobId: 'job1', notes: 'Work completed' };
      const result = await addWorkNotesHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Work notes added to job job1",
          },
        ],
      });
      expect(mockJobService.addWorkNotes).toHaveBeenCalledWith('job1', 'Work completed');
    });

    it('should throw error when jobId is missing', async () => {
      const args = { notes: 'Work completed' };

      await expect(addWorkNotesHandler.handle(args)).rejects.toThrow('Missing required argument: jobId');
      expect(mockJobService.addWorkNotes).not.toHaveBeenCalled();
    });

    it('should throw error when notes is missing', async () => {
      const args = { jobId: 'job1' };

      await expect(addWorkNotesHandler.handle(args)).rejects.toThrow('Missing required argument: notes');
      expect(mockJobService.addWorkNotes).not.toHaveBeenCalled();
    });
  });

  describe('GetJobsHandler', () => {
    it('should be defined', () => {
      expect(getJobsHandler).toBeDefined();
    });

    it('should get all jobs successfully', async () => {
      const mockJobs = [mockJob];
      mockJobService.findAll.mockResolvedValue(mockJobs);

      const result = await getJobsHandler.handle({});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockJobs, null, 2),
          },
        ],
      });
      expect(mockJobService.findAll).toHaveBeenCalledWith();
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Database error');
      mockJobService.findAll.mockRejectedValue(error);

      await expect(getJobsHandler.handle({})).rejects.toThrow('Database error');
    });
  });

  describe('CreateJobHandler', () => {
    it('should be defined', () => {
      expect(createJobHandler).toBeDefined();
    });

    it('should create job successfully with all required fields', async () => {
      mockJobService.create.mockResolvedValue(mockJob);

      const args = {
        title: 'Test Job',
        description: 'Test Description',
        customerName: 'Test Customer',
        customerAddress: '123 Test St',
        customerPhone: '+1234567890',
        assignedTechnician: 'tech1',
        scheduledStart: '2025-06-05T09:00:00Z',
        scheduledEnd: '2025-06-05T17:00:00Z',
      };

      const result = await createJobHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Job created successfully with ID: 1",
          },
        ],
      });
      expect(mockJobService.create).toHaveBeenCalledWith({
        title: 'Test Job',
        description: 'Test Description',
        customerName: 'Test Customer',
        customerAddress: '123 Test St',
        customerPhone: '+1234567890',
        assignedTechnician: 'tech1',
        scheduledStart: new Date('2025-06-05T09:00:00Z'),
        scheduledEnd: new Date('2025-06-05T17:00:00Z'),
        priority: Priority.MEDIUM,
      });
    });

    it('should create job with custom priority', async () => {
      mockJobService.create.mockResolvedValue(mockJob);

      const args = {
        title: 'Test Job',
        description: 'Test Description',
        customerName: 'Test Customer',
        customerAddress: '123 Test St',
        customerPhone: '+1234567890',
        assignedTechnician: 'tech1',
        scheduledStart: '2025-06-05T09:00:00Z',
        scheduledEnd: '2025-06-05T17:00:00Z',
        priority: 'HIGH',
      };

      const result = await createJobHandler.handle(args);

      expect(mockJobService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: 'HIGH',
        })
      );
    });

    it('should throw error when required fields are missing', async () => {
      const args = { title: 'Test Job' };

      await expect(createJobHandler.handle(args)).rejects.toThrow('Missing required argument: description');
      expect(mockJobService.create).not.toHaveBeenCalled();
    });
  });

  describe('RecordAssetUsageHandler', () => {
    it('should be defined', () => {
      expect(recordAssetUsageHandler).toBeDefined();
    });

    it('should record asset usage with default quantity', async () => {
      mockJobService.addAssetUsage.mockResolvedValue(undefined);

      const args = { jobId: 'job1', assetId: 'asset1' };
      const result = await recordAssetUsageHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Recorded usage of asset asset1 (quantity: 1) for job job1",
          },
        ],
      });
      expect(mockJobService.addAssetUsage).toHaveBeenCalledWith('job1', 'asset1', 1);
    });

    it('should record asset usage with specified quantity', async () => {
      mockJobService.addAssetUsage.mockResolvedValue(undefined);

      const args = { jobId: 'job1', assetId: 'asset1', quantity: '5' };
      const result = await recordAssetUsageHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Recorded usage of asset asset1 (quantity: 5) for job job1",
          },
        ],
      });
      expect(mockJobService.addAssetUsage).toHaveBeenCalledWith('job1', 'asset1', 5);
    });

    it('should throw error when required fields are missing', async () => {
      const args = { assetId: 'asset1' };

      await expect(recordAssetUsageHandler.handle(args)).rejects.toThrow('Missing required argument: jobId');
      expect(mockJobService.addAssetUsage).not.toHaveBeenCalled();
    });
  });
});
