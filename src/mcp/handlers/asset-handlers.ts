import { Injectable } from '@nestjs/common';
import { AssetService } from '../../asset/asset.service';
import { MpcHandlerInterface } from './base-handler.interface';
import { getArg, getOptionalArg, createSuccessResponse, createJsonResponse } from './utils';
import { AssetType } from '@prisma/client';

@Injectable()
export class GetAvailableAssetsHandler implements MpcHandlerInterface {
  constructor(private assetService: AssetService) {}

  async handle(args: any): Promise<any> {
    const type = getOptionalArg(args, 'type') as AssetType | undefined;

    const assets = await this.assetService.findAvailableAssets(type);
    return createJsonResponse(assets);
  }
}

@Injectable()
export class AssignAssetHandler implements MpcHandlerInterface {
  constructor(private assetService: AssetService) {}

  async handle(args: any): Promise<any> {
    const assetId = getArg(args, 'assetId');
    const technicianId = getArg(args, 'technicianId');

    await this.assetService.assignToTechnician(assetId, technicianId);
    return createSuccessResponse(`Asset ${assetId} assigned to technician ${technicianId}`);
  }
}
