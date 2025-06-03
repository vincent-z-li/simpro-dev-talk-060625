import { Technician, Job, Asset, TimeEntry } from './types.js';

export class FieldManagementStore {
  private technicians: Map<string, Technician> = new Map();
  private jobs: Map<string, Job> = new Map();
  private assets: Map<string, Asset> = new Map();
  private timeEntries: Map<string, TimeEntry> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Technicians
    const techs: Technician[] = [
      {
        id: "tech001",
        name: "John Smith",
        email: "john.smith@company.com",
        phone: "+1-555-0101",
        skills: ["HVAC", "Electrical", "Plumbing"],
        status: "available",
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: "123 Main St, New York, NY"
        }
      },
      {
        id: "tech002",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        phone: "+1-555-0102",
        skills: ["Electrical", "Security Systems"],
        status: "busy",
        location: {
          lat: 40.7589,
          lng: -73.9851,
          address: "456 Broadway, New York, NY"
        }
      },
      {
        id: "tech003",
        name: "Mike Chen",
        email: "mike.chen@company.com",
        phone: "+1-555-0103",
        skills: ["HVAC", "Mechanical"],
        status: "available"
      }
    ];

    techs.forEach(tech => this.technicians.set(tech.id, tech));

    // Sample Jobs
    const jobs: Job[] = [
      {
        id: "job001",
        title: "AC Unit Repair",
        description: "Customer reports AC not cooling properly. Need to diagnose and repair.",
        customer: {
          name: "ABC Corporation",
          address: "789 Business Ave, New York, NY 10001",
          phone: "+1-555-0201"
        },
        assignedTechnician: "tech001",
        scheduledStart: "2025-06-03T09:00:00Z",
        scheduledEnd: "2025-06-03T12:00:00Z",
        actualStart: "2025-06-03T09:15:00Z",
        status: "in_progress",
        priority: "high",
        workNotes: "Found refrigerant leak in evaporator coil. Ordering replacement part.",
        assetsUsed: ["asset001", "asset003"]
      },
      {
        id: "job002",
        title: "Electrical Panel Inspection",
        description: "Annual electrical panel safety inspection and testing.",
        customer: {
          name: "Downtown Hotel",
          address: "321 Hotel Plaza, New York, NY 10002",
          phone: "+1-555-0202"
        },
        assignedTechnician: "tech002",
        scheduledStart: "2025-06-03T14:00:00Z",
        scheduledEnd: "2025-06-03T16:00:00Z",
        status: "scheduled",
        priority: "medium"
      },
      {
        id: "job003",
        title: "Heating System Maintenance",
        description: "Quarterly heating system maintenance and filter replacement.",
        customer: {
          name: "Retail Store Chain",
          address: "555 Shopping Center, New York, NY 10003",
          phone: "+1-555-0203"
        },
        assignedTechnician: "tech003",
        scheduledStart: "2025-06-04T08:00:00Z",
        scheduledEnd: "2025-06-04T10:00:00Z",
        status: "scheduled",
        priority: "low"
      }
    ];

    jobs.forEach(job => this.jobs.set(job.id, job));

    // Sample Assets
    const assets: Asset[] = [
      {
        id: "asset001",
        name: "Digital Multimeter",
        type: "tool",
        description: "Fluke 87V Industrial Multimeter",
        quantity: 5,
        location: "Warehouse A",
        assignedTo: "tech001",
        condition: "excellent",
        lastMaintenance: "2025-05-01T00:00:00Z"
      },
      {
        id: "asset002",
        name: "Pipe Wrench Set",
        type: "tool",
        description: "Heavy-duty pipe wrench set (6\", 10\", 14\")",
        quantity: 3,
        location: "Van 002",
        assignedTo: "tech002",
        condition: "good"
      },
      {
        id: "asset003",
        name: "Refrigerant Recovery Unit",
        type: "equipment",
        description: "R-410A refrigerant recovery and recycling unit",
        quantity: 2,
        location: "Warehouse B",
        condition: "good",
        lastMaintenance: "2025-04-15T00:00:00Z"
      },
      {
        id: "asset004",
        name: "HVAC Filters",
        type: "part",
        description: "20x25x1 MERV 11 air filters",
        quantity: 50,
        location: "Warehouse A",
        condition: "excellent"
      }
    ];

    assets.forEach(asset => this.assets.set(asset.id, asset));

    // Sample Time Entries
    const timeEntries: TimeEntry[] = [
      {
        id: "time001",
        technicianId: "tech001",
        jobId: "job001",
        startTime: "2025-06-03T09:15:00Z",
        notes: "Started diagnosing AC unit issue"
      }
    ];

    timeEntries.forEach(entry => this.timeEntries.set(entry.id, entry));
  }

  // Technician methods
  getTechnicians(): Technician[] {
    return Array.from(this.technicians.values());
  }

  getTechnician(id: string): Technician | undefined {
    return this.technicians.get(id);
  }

  updateTechnicianStatus(id: string, status: Technician['status']): boolean {
    const tech = this.technicians.get(id);
    if (tech) {
      tech.status = status;
      return true;
    }
    return false;
  }

  updateTechnicianLocation(id: string, location: Technician['location']): boolean {
    const tech = this.technicians.get(id);
    if (tech) {
      tech.location = location;
      return true;
    }
    return false;
  }

  // Job methods
  getJobs(technicianId?: string, status?: Job['status']): Job[] {
    let jobs = Array.from(this.jobs.values());
    
    if (technicianId) {
      jobs = jobs.filter(job => job.assignedTechnician === technicianId);
    }
    
    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }
    
    return jobs;
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  updateJobStatus(id: string, status: Job['status']): boolean {
    const job = this.jobs.get(id);
    if (job) {
      job.status = status;
      if (status === 'in_progress' && !job.actualStart) {
        job.actualStart = new Date().toISOString();
      } else if (status === 'completed' && !job.actualEnd) {
        job.actualEnd = new Date().toISOString();
      }
      return true;
    }
    return false;
  }

  updateJobNotes(id: string, notes: string): boolean {
    const job = this.jobs.get(id);
    if (job) {
      job.workNotes = notes;
      return true;
    }
    return false;
  }

  addAssetToJob(jobId: string, assetId: string): boolean {
    const job = this.jobs.get(jobId);
    const asset = this.assets.get(assetId);
    
    if (job && asset) {
      if (!job.assetsUsed) {
        job.assetsUsed = [];
      }
      if (!job.assetsUsed.includes(assetId)) {
        job.assetsUsed.push(assetId);
      }
      return true;
    }
    return false;
  }

  // Asset methods
  getAssets(type?: Asset['type'], assignedTo?: string): Asset[] {
    let assets = Array.from(this.assets.values());
    
    if (type) {
      assets = assets.filter(asset => asset.type === type);
    }
    
    if (assignedTo) {
      assets = assets.filter(asset => asset.assignedTo === assignedTo);
    }
    
    return assets;
  }

  getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  assignAsset(assetId: string, technicianId: string): boolean {
    const asset = this.assets.get(assetId);
    const tech = this.technicians.get(technicianId);
    
    if (asset && tech) {
      asset.assignedTo = technicianId;
      return true;
    }
    return false;
  }

  // Time tracking methods
  startTimeEntry(technicianId: string, jobId: string, notes?: string): string {
    const id = `time${Date.now()}`;
    const entry: TimeEntry = {
      id,
      technicianId,
      jobId,
      startTime: new Date().toISOString(),
      notes
    };
    
    this.timeEntries.set(id, entry);
    return id;
  }

  endTimeEntry(id: string, notes?: string): boolean {
    const entry = this.timeEntries.get(id);
    if (entry && !entry.endTime) {
      entry.endTime = new Date().toISOString();
      if (notes) {
        entry.notes = notes;
      }
      return true;
    }
    return false;
  }

  getTimeEntries(technicianId?: string, jobId?: string): TimeEntry[] {
    let entries = Array.from(this.timeEntries.values());
    
    if (technicianId) {
      entries = entries.filter(entry => entry.technicianId === technicianId);
    }
    
    if (jobId) {
      entries = entries.filter(entry => entry.jobId === jobId);
    }
    
    return entries;
  }
}
