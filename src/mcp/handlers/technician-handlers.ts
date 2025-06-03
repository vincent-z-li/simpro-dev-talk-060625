import { Injectable } from '@nestjs/common';
import { TechnicianService } from '../../technician/technician.service';
import { MpcHandlerInterface } from './base-handler.interface';
import { getArg, getOptionalArg, createJsonResponse } from './utils';

@Injectable()
export class TechnicianHandler implements MpcHandlerInterface {
  constructor(private technicianService: TechnicianService) {}

  async handle(args: any): Promise<any> {
    const technicians = await this.technicianService.findAll();
    return createJsonResponse(technicians);
  }
}

@Injectable()
export class TechnicianScheduleHandler implements MpcHandlerInterface {
  constructor(private technicianService: TechnicianService) {}

  async handle(args: any): Promise<any> {
    const technicianId = getArg(args, 'technicianId');
    const date = getOptionalArg(args, 'date');

    const schedule = await this.technicianService.getSchedule(technicianId, date);
    return createJsonResponse(schedule);
  }
}
