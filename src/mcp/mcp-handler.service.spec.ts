import { Test, TestingModule } from '@nestjs/testing';
import { McpHandlerService } from './mcp-handler.service';
import { TechnicianService } from '../technician/technician.service';
import { JobService } from '../job/job.service';
import { AssetService } from '../asset/asset.service';
import { TimeEntryService } from '../time-entry/time-entry.service';
import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";

describe('McpHandlerService', () => {
  let service: McpHandlerService;
  let technicianService: TechnicianService;
  let jobService: JobService;
  let assetService: AssetService;
  let timeEntryService: TimeEntryService;

  const mockTechnicianService = {
    findAll: jest.fn(),
    getSchedule: jest.fn(),
  };

  const mockJobService = {
    findAll: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    addWorkNotes: jest.fn(),
    addAssetUsage: jest.fn(),
  };

  const mockAssetService = {
    findAvailableAssets: jest.fn(),
    assignToTechnician: jest.fn(),
  };

  const mockTimeEntryService = {
    startTime: jest.fn(),
    endTime: jest.fn(),
    findByTechnician: jest.fn(),
    findByJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        McpHandlerService,
        {
          provide: TechnicianService,
          useValue: mockTechnicianService,
        },
        {
          provide: JobService,
          useValue: mockJobService,
        },
        {
          provide: AssetService,
          useValue: mockAssetService,
        },
        {
          provide: TimeEntryService,
          useValue: mockTimeEntryService,
        },
      ],
    }).compile();

    service = module.get<McpHandlerService>(McpHandlerService);
    technicianService = module.get<TechnicianService>(TechnicianService);
    jobService = module.get<JobService>(JobService);
    assetService = module.get<AssetService>(AssetService);
    timeEntryService = module.get<TimeEntryService>(TimeEntryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleToolCall', () => {
    it('should handle get_technicians tool call', async () => {
      const mockTechnicians = [{ id: '1', name: 'John Doe' }];
      mockTechnicianService.findAll.mockResolvedValue(mockTechnicians);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get_technicians',
          arguments: {},
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockTechnicians, null, 2),
          },
        ],
      });
      expect(mockTechnicianService.findAll).toHaveBeenCalledWith();
    });

    it('should handle get_technician_schedule tool call', async () => {
      const mockSchedule = [{ id: 'job1', title: 'Test Job' }];
      mockTechnicianService.getSchedule.mockResolvedValue(mockSchedule);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get_technician_schedule',
          arguments: { technicianId: 'tech1' },
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockSchedule, null, 2),
          },
        ],
      });
      expect(mockTechnicianService.getSchedule).toHaveBeenCalledWith('tech1', undefined);
    });

    it('should handle update_job_status tool call', async () => {
      const mockJob = { id: 'job1', status: 'IN_PROGRESS' };
      mockJobService.updateStatus.mockResolvedValue(mockJob);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'update_job_status',
          arguments: { jobId: 'job1', status: 'IN_PROGRESS' },
        },
      };

      const result = await service.handleToolCall(request);

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

    it('should handle add_work_notes tool call', async () => {
      const mockJob = { id: 'job1', workNotes: 'Work completed' };
      mockJobService.addWorkNotes.mockResolvedValue(mockJob);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'add_work_notes',
          arguments: { jobId: 'job1', notes: 'Work completed' },
        },
      };

      const result = await service.handleToolCall(request);

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

    it('should handle get_available_assets tool call', async () => {
      const mockAssets = [{ id: 'asset1', name: 'Test Tool' }];
      mockAssetService.findAvailableAssets.mockResolvedValue(mockAssets);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get_available_assets',
          arguments: {},
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockAssets, null, 2),
          },
        ],
      });
      expect(mockAssetService.findAvailableAssets).toHaveBeenCalledWith(undefined);
    });

    it('should handle assign_asset tool call', async () => {
      const mockAsset = { id: 'asset1', assignedTo: 'tech1' };
      mockAssetService.assignToTechnician.mockResolvedValue(mockAsset);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'assign_asset',
          arguments: { assetId: 'asset1', technicianId: 'tech1' },
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Asset asset1 assigned to technician tech1",
          },
        ],
      });
      expect(mockAssetService.assignToTechnician).toHaveBeenCalledWith('asset1', 'tech1');
    });

    it('should handle start_time_tracking tool call', async () => {
      const mockTimeEntry = { id: 'entry1', technicianId: 'tech1', jobId: 'job1' };
      mockTimeEntryService.startTime.mockResolvedValue(mockTimeEntry);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'start_time_tracking',
          arguments: { technicianId: 'tech1', jobId: 'job1' },
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Time tracking started for technician tech1 on job job1. Time entry ID: entry1",
          },
        ],
      });
      expect(mockTimeEntryService.startTime).toHaveBeenCalledWith('tech1', 'job1');
    });

    it('should handle end_time_tracking tool call', async () => {
      const mockTimeEntry = { id: 'entry1', endTime: new Date() };
      mockTimeEntryService.endTime.mockResolvedValue(mockTimeEntry);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'end_time_tracking',
          arguments: { timeEntryId: 'entry1' },
        },
      };

      const result = await service.handleToolCall(request);

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

    it('should handle get_time_entries tool call', async () => {
      const mockTimeEntries = [{ id: 'entry1', technicianId: 'tech1' }];
      mockTimeEntryService.findByTechnician.mockResolvedValue(mockTimeEntries);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get_time_entries',
          arguments: { technicianId: 'tech1' },
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockTimeEntries, null, 2),
          },
        ],
      });
      expect(mockTimeEntryService.findByTechnician).toHaveBeenCalledWith('tech1', undefined);
    });

    it('should handle get_jobs tool call', async () => {
      const mockJobs = [{ id: 'job1', title: 'Test Job' }];
      mockJobService.findAll.mockResolvedValue(mockJobs);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get_jobs',
          arguments: {},
        },
      };

      const result = await service.handleToolCall(request);

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

    it('should handle create_job tool call', async () => {
      const mockJob = { id: 'job1', title: 'Test Job' };
      mockJobService.create.mockResolvedValue(mockJob);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'create_job',
          arguments: {
            title: 'Test Job',
            description: 'Test Description',
            customerName: 'Test Customer',
            customerAddress: '123 Test St',
            customerPhone: '+1234567890',
            assignedTechnician: 'tech1',
            scheduledStart: '2025-06-05T09:00:00Z',
            scheduledEnd: '2025-06-05T17:00:00Z',
          },
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Job created successfully with ID: job1",
          },
        ],
      });
      expect(mockJobService.create).toHaveBeenCalled();
    });

    it('should handle record_asset_usage tool call', async () => {
      mockJobService.addAssetUsage.mockResolvedValue(undefined);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'record_asset_usage',
          arguments: { jobId: 'job1', assetId: 'asset1', quantity: '2' },
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Recorded usage of asset asset1 (quantity: 2) for job job1",
          },
        ],
      });
      expect(mockJobService.addAssetUsage).toHaveBeenCalledWith('job1', 'asset1', 2);
    });

    it('should return error response for unknown tool', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'unknown_tool',
          arguments: {},
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error: Unknown tool: unknown_tool",
          },
        ],
        isError: true,
      });
    });

    it('should return error response when handler throws error', async () => {
      const error = new Error('Handler error');
      mockTechnicianService.findAll.mockRejectedValue(error);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get_technicians',
          arguments: {},
        },
      };

      const result = await service.handleToolCall(request);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error: Handler error",
          },
        ],
        isError: true,
      });
    });
  });
});
