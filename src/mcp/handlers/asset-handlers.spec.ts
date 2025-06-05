import { Test, TestingModule } from '@nestjs/testing';
import { GetAvailableAssetsHandler, AssignAssetHandler } from './asset-handlers';
import { AssetService } from '../../asset/asset.service';
import { AssetType } from '@prisma/client';

describe('AssetHandlers', () => {
  let assetService: AssetService;
  let getAvailableAssetsHandler: GetAvailableAssetsHandler;
  let assignAssetHandler: AssignAssetHandler;

  const mockAssetService = {
    findAvailableAssets: jest.fn(),
    assignToTechnician: jest.fn(),
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
      providers: [
        GetAvailableAssetsHandler,
        AssignAssetHandler,
        {
          provide: AssetService,
          useValue: mockAssetService,
        },
      ],
    }).compile();

    assetService = module.get<AssetService>(AssetService);
    getAvailableAssetsHandler = module.get<GetAvailableAssetsHandler>(GetAvailableAssetsHandler);
    assignAssetHandler = module.get<AssignAssetHandler>(AssignAssetHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GetAvailableAssetsHandler', () => {
    it('should be defined', () => {
      expect(getAvailableAssetsHandler).toBeDefined();
    });

    it('should get all available assets without type filter', async () => {
      const mockAssets = [mockAsset];
      mockAssetService.findAvailableAssets.mockResolvedValue(mockAssets);

      const result = await getAvailableAssetsHandler.handle({});

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

    it('should get available assets filtered by type', async () => {
      const mockAssets = [mockAsset];
      mockAssetService.findAvailableAssets.mockResolvedValue(mockAssets);

      const args = { type: 'TOOL' };
      const result = await getAvailableAssetsHandler.handle(args);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockAssets, null, 2),
          },
        ],
      });
      expect(mockAssetService.findAvailableAssets).toHaveBeenCalledWith('TOOL');
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Database error');
      mockAssetService.findAvailableAssets.mockRejectedValue(error);

      await expect(getAvailableAssetsHandler.handle({})).rejects.toThrow('Database error');
    });
  });

  describe('AssignAssetHandler', () => {
    it('should be defined', () => {
      expect(assignAssetHandler).toBeDefined();
    });

    it('should assign asset to technician successfully', async () => {
      const assignedAsset = { ...mockAsset, assignedTo: 'tech1' };
      mockAssetService.assignToTechnician.mockResolvedValue(assignedAsset);

      const args = { assetId: 'asset1', technicianId: 'tech1' };
      const result = await assignAssetHandler.handle(args);

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

    it('should throw error when assetId is missing', async () => {
      const args = { technicianId: 'tech1' };

      await expect(assignAssetHandler.handle(args)).rejects.toThrow('Missing required argument: assetId');
      expect(mockAssetService.assignToTechnician).not.toHaveBeenCalled();
    });

    it('should throw error when technicianId is missing', async () => {
      const args = { assetId: 'asset1' };

      await expect(assignAssetHandler.handle(args)).rejects.toThrow('Missing required argument: technicianId');
      expect(mockAssetService.assignToTechnician).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Asset not found');
      mockAssetService.assignToTechnician.mockRejectedValue(error);

      const args = { assetId: 'asset1', technicianId: 'tech1' };

      await expect(assignAssetHandler.handle(args)).rejects.toThrow('Asset not found');
    });
  });
});
