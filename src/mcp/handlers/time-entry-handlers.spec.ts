import { Test, TestingModule } from '@nestjs/testing';
import { 
  StartTimeTrackingHandler, 
  EndTimeTrackingHandler, 
  GetTimeEntriesHandler 
} from './time-entry-handlers';
import { TimeEntryService } from '../../time-entry/time-entry.service';

describe('TimeEntryHandlers', () => {
  let timeEntryService: TimeEntryService;
  let startTimeTrackingHandler: StartTimeTrackingHandler;
  let endTimeTrackingHandler: EndTimeTrackingHandler;
  let getTimeEntriesHandler: GetTimeEntriesHandler;

  const mockTimeEntryService = {
    startTime: jest.fn(),
    endTime: jest.fn(),
    findByTechnician: jest.fn(),
    findByJob: jest.fn(),
  };

  const mockTimeEntry = {
    id: '1',
    technicianId: 'tech1',
    jobId: 'job1',
    startTime: new Date('2025-06-05T09:00:00Z'),
    endTime: null,
    breakMinutes: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCompletedTimeEntry = {
    ...mockTimeEntry,
    endTime: new Date('2025-06-05T17:00:00Z'),
    breakMinutes: 30,
    notes: 'Work completed',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartTimeTrackingHandler,
        EndTimeTrackingHandler,
        GetTimeEntriesHandler,
        {
          provide: TimeEntryService,
          useValue: mockTimeEntryService,
        },
      ],
    }).compile();

    timeEntryService = module.get<TimeEntryService>(TimeEntryService);
    startTimeTrackingHandler = module.get<StartTimeTrackingHandler>(StartTimeTrackingHandler);
    endTimeTrackingHandler = module.get<EndTimeTrackingHandler>(EndTimeTrackingHandler);
    getTimeEntriesHandler = module.get<GetTimeEntriesHandler>(GetTimeEntriesHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('StartTimeTrackingHandler', () => {
    it('should be defined', () => {
      expect(startTimeTrackingHandler).toBeDefined();
    });

    it('should start time tracking successfully', async () => {
      mockTimeEntryService.startTime.mockResolvedValue(mockTimeEntry);

      const args = { technicianId: 'tech1', jobId: 'job1' };
      const result = await startTimeTrackingHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Time tracking started for technician tech1 on job job1. Time entry ID: 1",
          },
        ],
      });
      expect(mockTimeEntryService.startTime).toHaveBeenCalledWith('tech1', 'job1');
    });

    it('should throw error when technicianId is missing', async () => {
      const args = { jobId: 'job1' };

      await expect(startTimeTrackingHandler.handle(args)).rejects.toThrow('Missing required argument: technicianId');
      expect(mockTimeEntryService.startTime).not.toHaveBeenCalled();
    });

    it('should throw error when jobId is missing', async () => {
      const args = { technicianId: 'tech1' };

      await expect(startTimeTrackingHandler.handle(args)).rejects.toThrow('Missing required argument: jobId');
      expect(mockTimeEntryService.startTime).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Job not found');
      mockTimeEntryService.startTime.mockRejectedValue(error);

      const args = { technicianId: 'tech1', jobId: 'job1' };

      await expect(startTimeTrackingHandler.handle(args)).rejects.toThrow('Job not found');
    });
  });

  describe('EndTimeTrackingHandler', () => {
    it('should be defined', () => {
      expect(endTimeTrackingHandler).toBeDefined();
    });

    it('should end time tracking successfully with break minutes and notes', async () => {
      mockTimeEntryService.endTime.mockResolvedValue(mockCompletedTimeEntry);

      const args = { 
        timeEntryId: 'entry1', 
        breakMinutes: '30', 
        notes: 'Work completed' 
      };
      const result = await endTimeTrackingHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Time tracking ended for time entry entry1",
          },
        ],
      });
      expect(mockTimeEntryService.endTime).toHaveBeenCalledWith('entry1', 30, 'Work completed');
    });

    it('should end time tracking successfully without optional fields', async () => {
      mockTimeEntryService.endTime.mockResolvedValue(mockCompletedTimeEntry);

      const args = { timeEntryId: 'entry1' };
      const result = await endTimeTrackingHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Time tracking ended for time entry entry1",
          },
        ],
      });
      expect(mockTimeEntryService.endTime).toHaveBeenCalledWith('entry1', undefined, undefined);
    });

    it('should throw error when timeEntryId is missing', async () => {
      const args = { notes: 'Work completed' };

      await expect(endTimeTrackingHandler.handle(args)).rejects.toThrow('Missing required argument: timeEntryId');
      expect(mockTimeEntryService.endTime).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Time entry not found');
      mockTimeEntryService.endTime.mockRejectedValue(error);

      const args = { timeEntryId: 'entry1' };

      await expect(endTimeTrackingHandler.handle(args)).rejects.toThrow('Time entry not found');
    });
  });

  describe('GetTimeEntriesHandler', () => {
    it('should be defined', () => {
      expect(getTimeEntriesHandler).toBeDefined();
    });

    it('should get time entries by technician without date', async () => {
      const mockTimeEntries = [mockTimeEntry];
      mockTimeEntryService.findByTechnician.mockResolvedValue(mockTimeEntries);

      const args = { technicianId: 'tech1' };
      const result = await getTimeEntriesHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockTimeEntries, null, 2),
          },
        ],
      });
      expect(mockTimeEntryService.findByTechnician).toHaveBeenCalledWith('tech1', undefined);
      expect(mockTimeEntryService.findByJob).not.toHaveBeenCalled();
    });

    it('should get time entries by technician with date', async () => {
      const mockTimeEntries = [mockTimeEntry];
      mockTimeEntryService.findByTechnician.mockResolvedValue(mockTimeEntries);

      const args = { technicianId: 'tech1', date: '2025-06-05' };
      const result = await getTimeEntriesHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockTimeEntries, null, 2),
          },
        ],
      });
      expect(mockTimeEntryService.findByTechnician).toHaveBeenCalledWith('tech1', '2025-06-05');
      expect(mockTimeEntryService.findByJob).not.toHaveBeenCalled();
    });

    it('should get time entries by job', async () => {
      const mockTimeEntries = [mockTimeEntry];
      mockTimeEntryService.findByJob.mockResolvedValue(mockTimeEntries);

      const args = { jobId: 'job1' };
      const result = await getTimeEntriesHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockTimeEntries, null, 2),
          },
        ],
      });
      expect(mockTimeEntryService.findByJob).toHaveBeenCalledWith('job1');
      expect(mockTimeEntryService.findByTechnician).not.toHaveBeenCalled();
    });

    it('should throw error when neither technicianId nor jobId is provided', async () => {
      const args = {};

      await expect(getTimeEntriesHandler.handle(args)).rejects.toThrow('Either technicianId or jobId must be provided');
      expect(mockTimeEntryService.findByTechnician).not.toHaveBeenCalled();
      expect(mockTimeEntryService.findByJob).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Database error');
      mockTimeEntryService.findByTechnician.mockRejectedValue(error);

      const args = { technicianId: 'tech1' };

      await expect(getTimeEntriesHandler.handle(args)).rejects.toThrow('Database error');
    });
  });
});
