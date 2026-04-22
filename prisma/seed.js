require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding database...');
  
  // 1. Create Branches
  const branch1 = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'الفرع الرئيسي',
      location: 'وسط البلد',
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'فرع مول العرب',
      location: '6 أكتوبر',
    },
  });

  // 2. Add some initial inventory items to Branch 1
  await prisma.inventoryItem.create({
    data: {
      branchId: branch1.id,
      name: 'PlayStation 5 Disc Edition',
      category: 'أجهزة',
      condition: 'جديد',
      model: 'PS5_DISC',
      serialNumber: 'PS5-839201',
      buyPrice: 22000,
      sellPrice: 24500,
      quantity: 12,
      minStock: 2,
    }
  });

  await prisma.inventoryItem.create({
    data: {
      branchId: branch1.id,
      name: 'DualSense Wireless Controller - White',
      category: 'دراعات',
      condition: 'جديد',
      model: 'OTHER',
      serialNumber: 'DS-9921',
      barcode: '1234567890123',
      buyPrice: 2800,
      sellPrice: 3200,
      quantity: 25,
      minStock: 5,
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
