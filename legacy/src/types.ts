export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  status: 'available' | 'busy' | 'offline';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  assignedTechnician: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  workNotes?: string;
  assetsUsed?: string[];
  photos?: string[];
  customerSignature?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'tool' | 'equipment' | 'part' | 'material';
  description: string;
  quantity: number;
  location: string;
  assignedTo?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance?: string;
}

export interface TimeEntry {
  id: string;
  technicianId: string;
  jobId: string;
  startTime: string;
  endTime?: string;
  breakMinutes?: number;
  notes?: string;
}
