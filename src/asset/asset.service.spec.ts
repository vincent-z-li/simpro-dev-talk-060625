import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { PrismaService } from '../common/prisma.service';
import { AssetType, AssetCondition } from '@prisma/client';

describe('AssetService', () => {
  let service: AssetService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    asset: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of assets', async () => {
      const mockAssets = [
        {
          id: '1',
          name: 'Digital Multimeter',
          type: AssetType.TOOL,
          description: 'For electrical measurements',
          quantity: 5,
          location: 'Warehouse A',
          condition: AssetCondition.EXCELLENT,
          assignedTo: null,
          technician: null,
          usages: [],
        },
      ];

      mockPrismaService.asset.findMany.mockResolvedValue(mockAssets);

      const result = await service.findAll();

      expect(result).toEqual(mockAssets);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        include: {
          technician: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return an asset by id', async () => {
      const mockAsset = {
        id: '1',
        name: 'Digital Multimeter',
        type: AssetType.TOOL,
        description: 'For electrical measurements',
        quantity: 5,
        location: 'Warehouse A',
        condition: AssetCondition.EXCELLENT,
        assignedTo: null,
        technician: null,
        usages: [],
      };

      mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset);

      const result = await service.findOne('1');

      expect(result).toEqual(mockAsset);
      expect(mockPrismaService.asset.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          technician: true,
          assetUsages: {
            include: {
              job: true,
            },
          },
        },
      });
    });

    it('should return null if asset not found', async () => {
      mockPrismaService.asset.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new asset', async () => {
      const createAssetDto = {
        name: 'New Tool',
        type: AssetType.TOOL,
        description: 'A new tool',
        quantity: 3,
        location: 'Warehouse B',
        condition: AssetCondition.GOOD,
      };

      const mockCreatedAsset = {
        id: '2',
        ...createAssetDto,
        assignedTo: null,
        lastMaintenance: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.asset.create.mockResolvedValue(mockCreatedAsset);

      const result = await service.create(createAssetDto);

      expect(result).toEqual(mockCreatedAsset);
      expect(mockPrismaService.asset.create).toHaveBeenCalledWith({
        data: createAssetDto,
      });
    });
  });

  describe('update', () => {
    it('should update an asset', async () => {
      const updateData = {
        name: 'Updated Tool',
        quantity: 10,
      };

      const mockUpdatedAsset = {
        id: '1',
        name: 'Updated Tool',
        type: AssetType.TOOL,
        description: 'For electrical measurements',
        quantity: 10,
        location: 'Warehouse A',
        condition: AssetCondition.EXCELLENT,
        assignedTo: null,
        lastMaintenance: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.asset.update.mockResolvedValue(mockUpdatedAsset);

      const result = await service.update('1', updateData);

      expect(result).toEqual(mockUpdatedAsset);
      expect(mockPrismaService.asset.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete an asset', async () => {
      const mockDeletedAsset = {
        id: '1',
        name: 'Digital Multimeter',
        type: AssetType.TOOL,
        description: 'For electrical measurements',
        quantity: 5,
        location: 'Warehouse A',
        condition: AssetCondition.EXCELLENT,
        assignedTo: null,
        lastMaintenance: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.asset.delete.mockResolvedValue(mockDeletedAsset);

      const result = await service.delete('1');

      expect(result).toEqual(mockDeletedAsset);
      expect(mockPrismaService.asset.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findAvailableAssets', () => {
    it('should return available assets without type filter', async () => {
      const mockAssets = [
        {
          id: '1',
          name: 'Tool 1',
          type: AssetType.TOOL,
          quantity: 5,
          technician: null,
        },
        {
          id: '2',
          name: 'Equipment 1',
          type: AssetType.EQUIPMENT,
          quantity: 2,
          technician: null,
        },
      ];

      mockPrismaService.asset.findMany.mockResolvedValue(mockAssets);

      const result = await service.findAvailableAssets();

      expect(result).toEqual(mockAssets);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        where: {
          quantity: {
            gt: 0,
          },
        },
        include: {
          technician: true,
        },
      });
    });

    it('should return available assets with type filter', async () => {
      const mockAssets = [
        {
          id: '1',
          name: 'Tool 1',
          type: AssetType.TOOL,
          quantity: 5,
          technician: null,
        },
      ];

      mockPrismaService.asset.findMany.mockResolvedValue(mockAssets);

      const result = await service.findAvailableAssets(AssetType.TOOL);

      expect(result).toEqual(mockAssets);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        where: {
          quantity: {
            gt: 0,
          },
          type: AssetType.TOOL,
        },
        include: {
          technician: true,
        },
      });
    });
  });

  describe('assignToTechnician', () => {
    it('should assign asset to technician', async () => {
      const mockUpdatedAsset = {
        id: '1',
        name: 'Tool',
        assignedTo: 'tech1',
      };

      mockPrismaService.asset.update.mockResolvedValue(mockUpdatedAsset);

      const result = await service.assignToTechnician('1', 'tech1');

      expect(result).toEqual(mockUpdatedAsset);
      expect(mockPrismaService.asset.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { assignedTo: 'tech1' },
      });
    });
  });

  describe('unassignFromTechnician', () => {
    it('should unassign asset from technician', async () => {
      const mockUpdatedAsset = {
        id: '1',
        name: 'Tool',
        assignedTo: null,
      };

      mockPrismaService.asset.update.mockResolvedValue(mockUpdatedAsset);

      const result = await service.unassignFromTechnician('1');

      expect(result).toEqual(mockUpdatedAsset);
      expect(mockPrismaService.asset.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { assignedTo: null },
      });
    });
  });

  describe('updateQuantity', () => {
    it('should update asset quantity', async () => {
      const mockUpdatedAsset = {
        id: '1',
        name: 'Tool',
        quantity: 15,
      };

      mockPrismaService.asset.update.mockResolvedValue(mockUpdatedAsset);

      const result = await service.updateQuantity('1', 15);

      expect(result).toEqual(mockUpdatedAsset);
      expect(mockPrismaService.asset.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { quantity: 15 },
      });
    });
  });
});
