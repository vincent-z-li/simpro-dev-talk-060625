import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { TechnicianModule } from './technician/technician.module';
import { JobModule } from './job/job.module';
import { AssetModule } from './asset/asset.module';
import { TimeEntryModule } from './time-entry/time-entry.module';
import { McpService } from './mcp/mcp.service';
import { McpHandlerService } from './mcp/mcp-handler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TechnicianModule,
    JobModule,
    AssetModule,
    TimeEntryModule,
  ],
  providers: [
    PrismaService,
    McpHandlerService,
    McpService,
  ],
})
export class AppModule {}
