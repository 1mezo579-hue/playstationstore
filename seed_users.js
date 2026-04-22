const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing users...');
  await prisma.user.deleteMany({});

  console.log('Seeding 3 main users...');
  
  const owner = await prisma.user.create({
    data: {
      name: 'إسلام (الأونر)',
      username: 'owner',
      password: 'owner_password',
      role: 'OWNER'
    }
  });

  const maintenance = await prisma.user.create({
    data: {
      name: 'مهندس الصيانة',
      username: 'maintenance',
      password: 'maintenance_password',
      role: 'MAINTENANCE'
    }
  });

  const seller = await prisma.user.create({
    data: {
      name: 'موظف المبيعات',
      username: 'seller',
      password: 'seller_password',
      role: 'SELLER'
    }
  });

  console.log('Users created successfully:');
  console.log('- Owner: owner / owner_password');
  console.log('- Maintenance: maintenance / maintenance_password');
  console.log('- Seller: seller / seller_password');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
