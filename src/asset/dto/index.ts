import { AssetType, AssetCondition } from '@prisma/client';

export class CreateAssetDto {
  name: string;
  type: AssetType;
  description: string;
  quantity: number;
  location: string;
  assignedTo?: string;
  condition?: AssetCondition;
  lastMaintenance?: Date;
}

export class UpdateAssetDto {
  name?: string;
  type?: AssetType;
  description?: string;
  quantity?: number;
  location?: string;
  assignedTo?: string;
  condition?: AssetCondition;
  lastMaintenance?: Date;
}
