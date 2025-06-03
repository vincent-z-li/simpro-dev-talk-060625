import { PrismaClient, TechnicianStatus, JobStatus, Priority, AssetType, AssetCondition } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const technicians = await Promise.all([
    prisma.technician.create({
      data: {
        name: "John Smith",
        email: "john.smith@company.com",
        phone: "+1-555-0101",
        skills: ["HVAC", "Electrical", "Plumbing"],
        status: TechnicianStatus.AVAILABLE,
        lat: 40.7128,
        lng: -74.0060,
        address: "123 Main St, New York, NY"
      }
    }),
    prisma.technician.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        phone: "+1-555-0102",
        skills: ["Electrical", "Security Systems"],
        status: TechnicianStatus.BUSY,
        lat: 40.7589,
        lng: -73.9851,
        address: "456 Broadway, New York, NY"
      }
    }),
    prisma.technician.create({
      data: {
        name: "Mike Chen",
        email: "mike.chen@company.com",
        phone: "+1-555-0103",
        skills: ["HVAC", "Mechanical"],
        status: TechnicianStatus.AVAILABLE
      }
    })
  ]);

  console.log('Created technicians:', technicians.length);

  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        name: "HVAC Multimeter",
        type: AssetType.TOOL,
        description: "Digital multimeter for HVAC diagnostics",
        quantity: 5,
        location: "Tool Room A",
        condition: AssetCondition.EXCELLENT
      }
    }),
    prisma.asset.create({
      data: {
        name: "Pipe Wrench Set",
        type: AssetType.TOOL,
        description: "Professional pipe wrench set",
        quantity: 3,
        location: "Tool Room A",
        condition: AssetCondition.GOOD,
        assignedTo: technicians[0].id
      }
    }),
    prisma.asset.create({
      data: {
        name: "Refrigerant R-410A",
        type: AssetType.MATERIAL,
        description: "R-410A refrigerant for AC systems",
        quantity: 10,
        location: "Material Storage",
        condition: AssetCondition.EXCELLENT
      }
    }),
    prisma.asset.create({
      data: {
        name: "Evaporator Coil",
        type: AssetType.PART,
        description: "Replacement evaporator coil for AC units",
        quantity: 2,
        location: "Parts Storage",
        condition: AssetCondition.EXCELLENT
      }
    }),
    prisma.asset.create({
      data: {
        name: "Industrial Vacuum",
        type: AssetType.EQUIPMENT,
        description: "Heavy-duty industrial vacuum cleaner",
        quantity: 1,
        location: "Equipment Bay",
        condition: AssetCondition.GOOD,
        assignedTo: technicians[1].id
      }
    })
  ]);

  console.log('Created assets:', assets.length);

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: "AC Unit Repair",
        description: "Customer reports AC not cooling properly. Need to diagnose and repair.",
        customerName: "ABC Corporation",
        customerAddress: "789 Business Ave, New York, NY 10001",
        customerPhone: "+1-555-0201",
        assignedTechnician: technicians[0].id,
        scheduledStart: new Date("2025-06-03T09:00:00Z"),
        scheduledEnd: new Date("2025-06-03T12:00:00Z"),
        actualStart: new Date("2025-06-03T09:15:00Z"),
        status: JobStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        workNotes: "Found refrigerant leak in evaporator coil. Ordering replacement part."
      }
    }),
    prisma.job.create({
      data: {
        title: "Electrical Panel Inspection",
        description: "Annual electrical panel safety inspection and testing.",
        customerName: "Downtown Hotel",
        customerAddress: "321 Hotel Plaza, New York, NY 10002",
        customerPhone: "+1-555-0202",
        assignedTechnician: technicians[1].id,
        scheduledStart: new Date("2025-06-03T14:00:00Z"),
        scheduledEnd: new Date("2025-06-03T16:00:00Z"),
        status: JobStatus.SCHEDULED,
        priority: Priority.MEDIUM
      }
    }),
    prisma.job.create({
      data: {
        title: "Heating System Maintenance",
        description: "Quarterly heating system maintenance and filter replacement.",
        customerName: "Retail Store Chain",
        customerAddress: "555 Shopping Center, New York, NY 10003",
        customerPhone: "+1-555-0203",
        assignedTechnician: technicians[2].id,
        scheduledStart: new Date("2025-06-04T08:00:00Z"),
        scheduledEnd: new Date("2025-06-04T10:00:00Z"),
        status: JobStatus.SCHEDULED,
        priority: Priority.LOW
      }
    })
  ]);

  console.log('Created jobs:', jobs.length);

  await prisma.assetUsage.createMany({
    data: [
      {
        jobId: jobs[0].id,
        assetId: assets[0].id, // HVAC Multimeter
        quantityUsed: 1
      },
      {
        jobId: jobs[0].id,
        assetId: assets[2].id, // Refrigerant
        quantityUsed: 2
      }
    ]
  });

  await prisma.timeEntry.create({
    data: {
      technicianId: technicians[0].id,
      jobId: jobs[0].id,
      startTime: new Date("2025-06-03T09:15:00Z"),
      notes: "Started diagnostic on AC unit"
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
