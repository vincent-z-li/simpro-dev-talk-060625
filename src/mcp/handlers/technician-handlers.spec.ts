import { Test, TestingModule } from '@nestjs/testing';
import { TechnicianHandler, TechnicianScheduleHandler } from './technician-handlers';
import { TechnicianService } from '../../technician/technician.service';
import { TechnicianStatus } from '@prisma/client';

describe('TechnicianHandlers', () => {
  let technicianService: TechnicianService;
  let technicianHandler: TechnicianHandler;
  let technicianScheduleHandler: TechnicianScheduleHandler;

  const mockTechnicianService = {
    findAll: jest.fn(),
    getSchedule: jest.fn(),
  };

  const mockTechnician = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    skills: ['plumbing', 'electrical'],
    status: TechnicianStatus.AVAILABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSchedule = [
    {
      id: 'job1',
      title: 'Test Job',
      scheduledStart: new Date('2025-06-05T09:00:00Z'),
      scheduledEnd: new Date('2025-06-05T17:00:00Z'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnicianHandler,
        TechnicianScheduleHandler,
        {
          provide: TechnicianService,
          useValue: mockTechnicianService,
        },
      ],
    }).compile();

    technicianService = module.get<TechnicianService>(TechnicianService);
    technicianHandler = module.get<TechnicianHandler>(TechnicianHandler);
    technicianScheduleHandler = module.get<TechnicianScheduleHandler>(TechnicianScheduleHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TechnicianHandler', () => {
    it('should be defined', () => {
      expect(technicianHandler).toBeDefined();
    });

    it('should handle get technicians request', async () => {
      const mockTechnicians = [mockTechnician];
      mockTechnicianService.findAll.mockResolvedValue(mockTechnicians);

      const result = await technicianHandler.handle({});

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

    it('should handle service errors gracefully', async () => {
      const error = new Error('Service error');
      mockTechnicianService.findAll.mockRejectedValue(error);

      await expect(technicianHandler.handle({})).rejects.toThrow('Service error');
    });
  });

  describe('TechnicianScheduleHandler', () => {
    it('should be defined', () => {
      expect(technicianScheduleHandler).toBeDefined();
    });

    it('should handle get technician schedule request without date', async () => {
      mockTechnicianService.getSchedule.mockResolvedValue(mockSchedule);

      const args = { technicianId: 'tech1' };
      const result = await technicianScheduleHandler.handle(args);

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

    it('should handle get technician schedule request with date', async () => {
      mockTechnicianService.getSchedule.mockResolvedValue(mockSchedule);

      const args = { technicianId: 'tech1', date: '2025-06-05' };
      const result = await technicianScheduleHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockSchedule, null, 2),
          },
        ],
      });
      expect(mockTechnicianService.getSchedule).toHaveBeenCalledWith('tech1', '2025-06-05');
    });

    it('should throw error when technicianId is missing', async () => {
      const args = {};

      await expect(technicianScheduleHandler.handle(args)).rejects.toThrow('Missing required argument: technicianId');
      expect(mockTechnicianService.getSchedule).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Technician not found');
      mockTechnicianService.getSchedule.mockRejectedValue(error);

      const args = { technicianId: 'tech1' };

      await expect(technicianScheduleHandler.handle(args)).rejects.toThrow('Technician not found');
    });
  });
});
