import { Test, TestingModule } from '@nestjs/testing';
import { TechnicianController } from './technician.controller';
import { TechnicianService } from './technician.service';
import { CreateTechnicianDto, UpdateTechnicianDto } from './dto';
import { TechnicianStatus } from '@prisma/client';

describe('TechnicianController', () => {
  let controller: TechnicianController;
  let service: TechnicianService;

  const mockTechnicianService = {
    findAll: jest.fn(),
    findByStatus: jest.fn(),
    findOne: jest.fn(),
    getSchedule: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicianController],
      providers: [
        {
          provide: TechnicianService,
          useValue: mockTechnicianService,
        },
      ],
    }).compile();

    controller = module.get<TechnicianController>(TechnicianController);
    service = module.get<TechnicianService>(TechnicianService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all technicians when no status filter', async () => {
      const mockTechnicians = [mockTechnician];
      mockTechnicianService.findAll.mockResolvedValue(mockTechnicians);

      const result = await controller.findAll();

      expect(result).toEqual(mockTechnicians);
      expect(mockTechnicianService.findAll).toHaveBeenCalledWith();
      expect(mockTechnicianService.findByStatus).not.toHaveBeenCalled();
    });

    it('should return technicians filtered by status', async () => {
      const mockTechnicians = [mockTechnician];
      mockTechnicianService.findByStatus.mockResolvedValue(mockTechnicians);

      const result = await controller.findAll(TechnicianStatus.AVAILABLE);

      expect(result).toEqual(mockTechnicians);
      expect(mockTechnicianService.findByStatus).toHaveBeenCalledWith(TechnicianStatus.AVAILABLE);
      expect(mockTechnicianService.findAll).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a technician by id', async () => {
      mockTechnicianService.findOne.mockResolvedValue(mockTechnician);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockTechnician);
      expect(mockTechnicianService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('getSchedule', () => {
    it('should return technician schedule without date', async () => {
      const mockSchedule = [{ id: 'job1', title: 'Test Job' }];
      mockTechnicianService.getSchedule.mockResolvedValue(mockSchedule);

      const result = await controller.getSchedule('1');

      expect(result).toEqual(mockSchedule);
      expect(mockTechnicianService.getSchedule).toHaveBeenCalledWith('1', undefined);
    });

    it('should return technician schedule with date', async () => {
      const mockSchedule = [{ id: 'job1', title: 'Test Job' }];
      mockTechnicianService.getSchedule.mockResolvedValue(mockSchedule);

      const result = await controller.getSchedule('1', '2025-06-05');

      expect(result).toEqual(mockSchedule);
      expect(mockTechnicianService.getSchedule).toHaveBeenCalledWith('1', '2025-06-05');
    });
  });

  describe('create', () => {
    it('should create a new technician', async () => {
      const createDto: CreateTechnicianDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        skills: ['plumbing'],
        status: TechnicianStatus.AVAILABLE,
      };
      mockTechnicianService.create.mockResolvedValue(mockTechnician);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockTechnician);
      expect(mockTechnicianService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a technician', async () => {
      const updateDto: UpdateTechnicianDto = {
        name: 'John Updated',
        status: TechnicianStatus.BUSY,
      };
      const updatedTechnician = { ...mockTechnician, ...updateDto };
      mockTechnicianService.update.mockResolvedValue(updatedTechnician);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedTechnician);
      expect(mockTechnicianService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a technician', async () => {
      mockTechnicianService.delete.mockResolvedValue(mockTechnician);

      const result = await controller.remove('1');

      expect(result).toEqual(mockTechnician);
      expect(mockTechnicianService.delete).toHaveBeenCalledWith('1');
    });
  });
});
