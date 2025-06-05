import { Test, TestingModule } from '@nestjs/testing';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryService } from './time-entry.service';
import { CreateTimeEntryDto, UpdateTimeEntryDto, StartTimeTrackingDto, EndTimeTrackingDto } from './dto';

describe('TimeEntryController', () => {
  let controller: TimeEntryController;
  let service: TimeEntryService;

  const mockTimeEntryService = {
    findByTechnician: jest.fn(),
    findByJob: jest.fn(),
    create: jest.fn(),
    startTime: jest.fn(),
    update: jest.fn(),
    endTime: jest.fn(),
    getTotalHours: jest.fn(),
  };

  const mockTimeEntry = {
    id: '1',
    technicianId: 'tech1',
    jobId: 'job1',
    startTime: new Date('2025-06-05T09:00:00Z'),
    endTime: new Date('2025-06-05T17:00:00Z'),
    breakMinutes: 30,
    notes: 'Work completed',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeEntryController],
      providers: [
        {
          provide: TimeEntryService,
          useValue: mockTimeEntryService,
        },
      ],
    }).compile();

    controller = module.get<TimeEntryController>(TimeEntryController);
    service = module.get<TimeEntryService>(TimeEntryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return time entries by technician', async () => {
      const mockTimeEntries = [mockTimeEntry];
      mockTimeEntryService.findByTechnician.mockResolvedValue(mockTimeEntries);

      const result = await controller.findAll('tech1');

      expect(result).toEqual(mockTimeEntries);
      expect(mockTimeEntryService.findByTechnician).toHaveBeenCalledWith('tech1', undefined);
      expect(mockTimeEntryService.findByJob).not.toHaveBeenCalled();
    });

    it('should return time entries by technician with date filter', async () => {
      const mockTimeEntries = [mockTimeEntry];
      mockTimeEntryService.findByTechnician.mockResolvedValue(mockTimeEntries);

      const result = await controller.findAll('tech1', undefined, '2025-06-05');

      expect(result).toEqual(mockTimeEntries);
      expect(mockTimeEntryService.findByTechnician).toHaveBeenCalledWith('tech1', '2025-06-05');
      expect(mockTimeEntryService.findByJob).not.toHaveBeenCalled();
    });

    it('should return time entries by job', async () => {
      const mockTimeEntries = [mockTimeEntry];
      mockTimeEntryService.findByJob.mockResolvedValue(mockTimeEntries);

      const result = await controller.findAll(undefined, 'job1');

      expect(result).toEqual(mockTimeEntries);
      expect(mockTimeEntryService.findByJob).toHaveBeenCalledWith('job1');
      expect(mockTimeEntryService.findByTechnician).not.toHaveBeenCalled();
    });

    it('should throw error when no filters provided', async () => {
      await expect(controller.findAll()).rejects.toThrow('Please provide either technicianId or jobId parameter');
      expect(mockTimeEntryService.findByTechnician).not.toHaveBeenCalled();
      expect(mockTimeEntryService.findByJob).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new time entry', async () => {
      const createDto: CreateTimeEntryDto = {
        technicianId: 'tech1',
        jobId: 'job1',
        startTime: new Date('2025-06-05T09:00:00Z'),
      };
      mockTimeEntryService.create.mockResolvedValue(mockTimeEntry);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockTimeEntry);
      expect(mockTimeEntryService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('startTimeTracking', () => {
    it('should start time tracking', async () => {
      const startTimeDto: StartTimeTrackingDto = {
        technicianId: 'tech1',
        jobId: 'job1',
      };
      mockTimeEntryService.startTime.mockResolvedValue(mockTimeEntry);

      const result = await controller.startTimeTracking(startTimeDto);

      expect(result).toEqual(mockTimeEntry);
      expect(mockTimeEntryService.startTime).toHaveBeenCalledWith('tech1', 'job1');
    });
  });

  describe('update', () => {
    it('should update a time entry', async () => {
      const updateDto: UpdateTimeEntryDto = {
        breakMinutes: 45,
        notes: 'Updated notes',
      };
      const updatedTimeEntry = { ...mockTimeEntry, ...updateDto };
      mockTimeEntryService.update.mockResolvedValue(updatedTimeEntry);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedTimeEntry);
      expect(mockTimeEntryService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('endTimeTracking', () => {
    it('should end time tracking', async () => {
      const endTimeDto: EndTimeTrackingDto = {
        breakMinutes: 30,
        notes: 'Work completed',
      };
      const endedTimeEntry = { ...mockTimeEntry, endTime: new Date() };
      mockTimeEntryService.endTime.mockResolvedValue(endedTimeEntry);

      const result = await controller.endTimeTracking('1', endTimeDto);

      expect(result).toEqual(endedTimeEntry);
      expect(mockTimeEntryService.endTime).toHaveBeenCalledWith('1', 30, 'Work completed');
    });
  });

  describe('getTotalHours', () => {
    it('should get total hours for technician in date range', async () => {
      const totalHours = 40.5;
      mockTimeEntryService.getTotalHours.mockResolvedValue(totalHours);

      const result = await controller.getTotalHours('tech1', '2025-06-01', '2025-06-07');

      expect(result).toEqual({
        technicianId: 'tech1',
        startDate: '2025-06-01',
        endDate: '2025-06-07',
        totalHours: 40.5,
      });
      expect(mockTimeEntryService.getTotalHours).toHaveBeenCalledWith(
        'tech1',
        new Date('2025-06-01'),
        new Date('2025-06-07'),
      );
    });
  });
});
