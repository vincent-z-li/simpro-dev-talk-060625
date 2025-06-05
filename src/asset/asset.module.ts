import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [AssetController],
  providers: [AssetService, PrismaService],
  exports: [AssetService],
})
export class AssetModule {}
