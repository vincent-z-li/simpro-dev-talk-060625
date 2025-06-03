import { TechnicianStatus } from '@prisma/client';

export class CreateTechnicianDto {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  status?: TechnicianStatus;
  lat?: number;
  lng?: number;
  address?: string;
}

export class UpdateTechnicianDto {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  status?: TechnicianStatus;
  lat?: number;
  lng?: number;
  address?: string;
}
