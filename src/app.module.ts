import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { TechnicianService } from './technician/technician.service';
import { JobService } from './job/job.service';
import { AssetService } from './asset/asset.service';
import { TimeEntryService } from './time-entry/time-entry.service';
import { McpService } from './mcp/mcp.service';
import { McpHandlerService } from './mcp/mcp-handler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    TechnicianService,
    JobService,
    AssetService,
    TimeEntryService,
    McpHandlerService,
    McpService,
  ],
})
export class AppModule {}
