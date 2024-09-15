import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Reset all tables
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prisma.$executeRaw`TRUNCATE TABLE order_items;`;
  await prisma.$executeRaw`TRUNCATE TABLE orders;`;
  await prisma.$executeRaw`TRUNCATE TABLE products;`;
  await prisma.$executeRaw`TRUNCATE TABLE customers;`;
  await prisma.$executeRaw`TRUNCATE TABLE users;`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;

  console.log('All tables have been reset.');

  // Seed Users
  await prisma.user.create({
    data: {
      name: 'Cooper Rosser',
      email: 'cooper@test.com',
      password: 'qweasd123',
    },
  });

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product A',
      price: 1000000,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product B',
      price: 1500000,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Product C',
      price: 1700000,
    },
  });

  // Create Customers
  const customers = [
    { name: 'Anugrah Store' },
    { name: 'Indomaret Senjaya' },
    { name: 'Kartika Putri' },
    { name: 'Food Eka' },
    { name: 'Berkah Sentosa' },
    { name: 'Akbar Berkah Jaya' },
    { name: 'Sosial Agensi Food' },
    { name: 'Midi Store' },
    { name: 'Seven Store' },
    { name: 'Eleven Store' },
  ];

  const customerRecords = await Promise.all(customers.map(customer => prisma.customer.create({ data: { name: customer.name } })));

  // Create Orders
  const orders = [
    {
      customerId: customerRecords[0].id,
      totalPrice: 4541000,
      items: [
        { productId: product1.id, quantity: 3, totalPrice: 3000000 },
        { productId: product2.id, quantity: 1, totalPrice: 1541000 },
      ],
      createdAt: new Date('2021-03-13T10:43:00'),
    },
    {
      customerId: customerRecords[1].id,
      totalPrice: 14234090,
      items: [{ productId: product1.id, quantity: 1, totalPrice: 14234090 }],
      createdAt: new Date('2021-03-01T20:11:00'),
    },
    {
      customerId: customerRecords[2].id,
      totalPrice: 7321090,
      items: [
        { productId: product1.id, quantity: 2, totalPrice: 2000000 },
        { productId: product2.id, quantity: 2, totalPrice: 5321090 },
      ],
      createdAt: new Date('2021-02-28T11:00:00'),
    },
    {
      customerId: customerRecords[3].id,
      totalPrice: 1400302,
      items: [{ productId: product1.id, quantity: 1, totalPrice: 1400302 }],
      createdAt: new Date('2021-02-28T10:48:00'),
    },
    {
      customerId: customerRecords[4].id,
      totalPrice: 27831193,
      items: [{ productId: product3.id, quantity: 1, totalPrice: 27831193 }],
      createdAt: new Date('2021-02-28T10:43:00'),
    },
    {
      customerId: customerRecords[5].id,
      totalPrice: 12000000,
      items: [{ productId: product2.id, quantity: 2, totalPrice: 12000000 }],
      createdAt: new Date('2021-03-01T20:11:00'),
    },
    {
      customerId: customerRecords[6].id,
      totalPrice: 7329112,
      items: [{ productId: product1.id, quantity: 1, totalPrice: 7329112 }],
      createdAt: new Date('2021-02-28T11:00:00'),
    },
    {
      customerId: customerRecords[7].id,
      totalPrice: 1000345,
      items: [{ productId: product1.id, quantity: 3, totalPrice: 1000345 }],
      createdAt: new Date('2021-02-28T10:48:00'),
    },
    {
      customerId: customerRecords[8].id,
      totalPrice: 1730298,
      items: [{ productId: product1.id, quantity: 2, totalPrice: 1730298 }],
      createdAt: new Date('2021-02-28T10:43:00'),
    },
    {
      customerId: customerRecords[9].id,
      totalPrice: 4910332,
      items: [{ productId: product1.id, quantity: 1, totalPrice: 4910332 }],
      createdAt: new Date('2021-02-28T10:48:00'),
    },
  ];

  await Promise.all(
    orders.map(order =>
      prisma.order.create({
        data: {
          customerId: order.customerId,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
          items: {
            create: order.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            })),
          },
        },
      }),
    ),
  );

  console.log('Seeder data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
