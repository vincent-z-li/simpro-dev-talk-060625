import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { CreateAssetDto, UpdateAssetDto, AssignAssetDto } from './dto';
import { AssetType } from '@prisma/client';

describe('AssetController', () => {
  let controller: AssetController;
  let service: AssetService;

  const mockAssetService = {
    findAll: jest.fn(),
    findAvailableAssets: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    assignToTechnician: jest.fn(),
    unassignFromTechnician: jest.fn(),
    updateQuantity: jest.fn(),
    delete: jest.fn(),
  };

  const mockAsset = {
    id: '1',
    name: 'Test Tool',
    type: AssetType.TOOL,
    description: 'A test tool',
    quantity: 5,
    assignedTo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        {
          provide: AssetService,
          useValue: mockAssetService,
        },
      ],
    }).compile();

    controller = module.get<AssetController>(AssetController);
    service = module.get<AssetService>(AssetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all assets when no filters', async () => {
      const mockAssets = [mockAsset];
      mockAssetService.findAll.mockResolvedValue(mockAssets);

      const result = await controller.findAll();

      expect(result).toEqual(mockAssets);
      expect(mockAssetService.findAll).toHaveBeenCalledWith();
      expect(mockAssetService.findAvailableAssets).not.toHaveBeenCalled();
    });

    it('should return available assets when available filter is true', async () => {
      const mockAssets = [mockAsset];
      mockAssetService.findAvailableAssets.mockResolvedValue(mockAssets);

      const result = await controller.findAll(undefined, true);

      expect(result).toEqual(mockAssets);
      expect(mockAssetService.findAvailableAssets).toHaveBeenCalledWith(undefined);
      expect(mockAssetService.findAll).not.toHaveBeenCalled();
    });

    it('should return available assets filtered by type', async () => {
      const mockAssets = [mockAsset];
      mockAssetService.findAvailableAssets.mockResolvedValue(mockAssets);

      const result = await controller.findAll(AssetType.TOOL, true);

      expect(result).toEqual(mockAssets);
      expect(mockAssetService.findAvailableAssets).toHaveBeenCalledWith(AssetType.TOOL);
      expect(mockAssetService.findAll).not.toHaveBeenCalled();
    });

    it('should return all assets when available filter is false', async () => {
      const mockAssets = [mockAsset];
      mockAssetService.findAll.mockResolvedValue(mockAssets);

      const result = await controller.findAll(AssetType.TOOL, false);

      expect(result).toEqual(mockAssets);
      expect(mockAssetService.findAll).toHaveBeenCalledWith();
      expect(mockAssetService.findAvailableAssets).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an asset by id', async () => {
      mockAssetService.findOne.mockResolvedValue(mockAsset);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockAsset);
      expect(mockAssetService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new asset', async () => {
      const createDto: CreateAssetDto = {
        name: 'Test Tool',
        type: AssetType.TOOL,
        description: 'A test tool',
        quantity: 5,
        location: 'Warehouse A',
      };
      mockAssetService.create.mockResolvedValue(mockAsset);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockAsset);
      expect(mockAssetService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an asset', async () => {
      const updateDto: UpdateAssetDto = {
        name: 'Updated Tool',
        quantity: 10,
      };
      const updatedAsset = { ...mockAsset, ...updateDto };
      mockAssetService.update.mockResolvedValue(updatedAsset);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedAsset);
      expect(mockAssetService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('assignToTechnician', () => {
    it('should assign asset to technician', async () => {
      const assignDto: AssignAssetDto = {
        technicianId: 'tech1',
      };
      const assignedAsset = { ...mockAsset, assignedTo: 'tech1' };
      mockAssetService.assignToTechnician.mockResolvedValue(assignedAsset);

      const result = await controller.assignToTechnician('1', assignDto);

      expect(result).toEqual(assignedAsset);
      expect(mockAssetService.assignToTechnician).toHaveBeenCalledWith('1', 'tech1');
    });
  });

  describe('unassignFromTechnician', () => {
    it('should unassign asset from technician', async () => {
      const unassignedAsset = { ...mockAsset, assignedTo: null };
      mockAssetService.unassignFromTechnician.mockResolvedValue(unassignedAsset);

      const result = await controller.unassignFromTechnician('1');

      expect(result).toEqual(unassignedAsset);
      expect(mockAssetService.unassignFromTechnician).toHaveBeenCalledWith('1');
    });
  });

  describe('updateQuantity', () => {
    it('should update asset quantity', async () => {
      const updatedAsset = { ...mockAsset, quantity: 15 };
      mockAssetService.updateQuantity.mockResolvedValue(updatedAsset);

      const result = await controller.updateQuantity('1', 15);

      expect(result).toEqual(updatedAsset);
      expect(mockAssetService.updateQuantity).toHaveBeenCalledWith('1', 15);
    });
  });

  describe('remove', () => {
    it('should delete an asset', async () => {
      mockAssetService.delete.mockResolvedValue(mockAsset);

      const result = await controller.remove('1');

      expect(result).toEqual(mockAsset);
      expect(mockAssetService.delete).toHaveBeenCalledWith('1');
    });
  });
});
