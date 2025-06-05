import { Test, TestingModule } from '@nestjs/testing';
import { TechnicianService } from './technician.service';
import { PrismaService } from '../common/prisma.service';
import { TechnicianStatus } from '@prisma/client';

describe('TechnicianService', () => {
  let service: TechnicianService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    technician: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    job: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnicianService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TechnicianService>(TechnicianService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of technicians', async () => {
      const mockTechnicians = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@test.com',
          phone: '+1234567890',
          skills: ['HVAC', 'Electrical'],
          status: TechnicianStatus.AVAILABLE,
          jobs: [],
          assets: [],
        },
      ];

      mockPrismaService.technician.findMany.mockResolvedValue(mockTechnicians);

      const result = await service.findAll();

      expect(result).toEqual(mockTechnicians);
      expect(mockPrismaService.technician.findMany).toHaveBeenCalledWith({
        include: {
          jobs: true,
          assets: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a technician by id', async () => {
      const mockTechnician = {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        phone: '+1234567890',
        skills: ['HVAC'],
        status: TechnicianStatus.AVAILABLE,
        jobs: [],
        assets: [],
        timeEntries: [],
      };

      mockPrismaService.technician.findUnique.mockResolvedValue(mockTechnician);

      const result = await service.findOne('1');

      expect(result).toEqual(mockTechnician);
      expect(mockPrismaService.technician.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          jobs: true,
          assets: true,
          timeEntries: true,
        },
      });
    });

    it('should return null if technician not found', async () => {
      mockPrismaService.technician.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new technician', async () => {
      const createTechnicianDto = {
        name: 'Jane Smith',
        email: 'jane@test.com',
        phone: '+1987654321',
        skills: ['Plumbing'],
      };

      const mockCreatedTechnician = {
        id: '2',
        ...createTechnicianDto,
        status: TechnicianStatus.AVAILABLE,
        lat: null,
        lng: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.technician.create.mockResolvedValue(mockCreatedTechnician);

      const result = await service.create(createTechnicianDto);

      expect(result).toEqual(mockCreatedTechnician);
      expect(mockPrismaService.technician.create).toHaveBeenCalledWith({
        data: createTechnicianDto,
      });
    });
  });

  describe('update', () => {
    it('should update a technician', async () => {
      const updateData = {
        name: 'John Smith',
        status: TechnicianStatus.BUSY,
      };

      const mockUpdatedTechnician = {
        id: '1',
        name: 'John Smith',
        email: 'john@test.com',
        phone: '+1234567890',
        skills: ['HVAC'],
        status: TechnicianStatus.BUSY,
        lat: null,
        lng: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.technician.update.mockResolvedValue(mockUpdatedTechnician);

      const result = await service.update('1', updateData);

      expect(result).toEqual(mockUpdatedTechnician);
      expect(mockPrismaService.technician.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete a technician', async () => {
      const mockDeletedTechnician = {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        phone: '+1234567890',
        skills: ['HVAC'],
        status: TechnicianStatus.AVAILABLE,
        lat: null,
        lng: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.technician.delete.mockResolvedValue(mockDeletedTechnician);

      const result = await service.delete('1');

      expect(result).toEqual(mockDeletedTechnician);
      expect(mockPrismaService.technician.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findByStatus', () => {
    it('should return technicians by status', async () => {
      const mockTechnicians = [
        {
          id: '1',
          name: 'John Doe',
          status: TechnicianStatus.AVAILABLE,
          jobs: [],
        },
      ];

      mockPrismaService.technician.findMany.mockResolvedValue(mockTechnicians);

      const result = await service.findByStatus(TechnicianStatus.AVAILABLE);

      expect(result).toEqual(mockTechnicians);
      expect(mockPrismaService.technician.findMany).toHaveBeenCalledWith({
        where: { status: TechnicianStatus.AVAILABLE },
        include: {
          jobs: true,
        },
      });
    });
  });

  describe('getSchedule', () => {
    it('should return technician schedule for a specific date', async () => {
      const mockJobs = [
        {
          id: '1',
          title: 'HVAC Repair',
          scheduledStart: new Date('2025-06-05T09:00:00Z'),
          scheduledEnd: new Date('2025-06-05T11:00:00Z'),
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);

      const result = await service.getSchedule('tech1', '2025-06-05');

      expect(result).toEqual(mockJobs);
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: {
          assignedTechnician: 'tech1',
          scheduledStart: {
            gte: new Date('2025-06-05'),
            lt: new Date('2025-06-06'),
          },
        },
        orderBy: {
          scheduledStart: 'asc',
        },
      });
    });

    it('should return schedule for today if no date provided', async () => {
      const mockJobs = [];
      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);

      const result = await service.getSchedule('tech1');

      expect(mockPrismaService.job.findMany).toHaveBeenCalled();
    });
  });
});
