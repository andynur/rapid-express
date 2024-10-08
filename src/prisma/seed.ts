import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

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
  const hashedPassword = await hash('qweasd123', 10);
  await prisma.user.create({
    data: {
      name: 'Cooper Rosser',
      email: 'cooper@test.com',
      password: hashedPassword,
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
        { productId: product1.id, qty: 3, totalPrice: 3000000 },
        { productId: product2.id, qty: 1, totalPrice: 1541000 },
      ],
      orderDate: new Date('2024-09-13T10:43:00'),
      createdAt: new Date('2024-09-13T10:43:00'),
    },
    {
      customerId: customerRecords[1].id,
      totalPrice: 14234090,
      items: [{ productId: product1.id, qty: 1, totalPrice: 14234090 }],
      orderDate: new Date('2024-09-01T20:11:00'),
      createdAt: new Date('2024-09-01T20:11:00'),
    },
    {
      customerId: customerRecords[2].id,
      totalPrice: 7321090,
      items: [
        { productId: product1.id, qty: 2, totalPrice: 2000000 },
        { productId: product2.id, qty: 2, totalPrice: 5321090 },
      ],
      orderDate: new Date('2024-09-09T11:00:00'),
      createdAt: new Date('2024-09-09T11:00:00'),
    },
    {
      customerId: customerRecords[3].id,
      totalPrice: 1400302,
      items: [{ productId: product1.id, qty: 1, totalPrice: 1400302 }],
      orderDate: new Date('2024-09-08T10:48:00'),
      createdAt: new Date('2024-09-08T10:48:00'),
    },
    {
      customerId: customerRecords[4].id,
      totalPrice: 27831193,
      items: [{ productId: product3.id, qty: 1, totalPrice: 27831193 }],
      orderDate: new Date('2024-09-08T10:43:00'),
      createdAt: new Date('2024-09-08T10:43:00'),
    },
    {
      customerId: customerRecords[5].id,
      totalPrice: 12000000,
      items: [{ productId: product2.id, qty: 2, totalPrice: 12000000 }],
      orderDate: new Date('2024-09-01T20:11:00'),
      createdAt: new Date('2024-09-01T20:11:00'),
    },
    {
      customerId: customerRecords[6].id,
      totalPrice: 7329112,
      items: [{ productId: product1.id, qty: 1, totalPrice: 7329112 }],
      orderDate: new Date('2024-09-09T11:00:00'),
      createdAt: new Date('2024-09-09T11:00:00'),
    },
    {
      customerId: customerRecords[7].id,
      totalPrice: 1000345,
      items: [{ productId: product1.id, qty: 3, totalPrice: 1000345 }],
      orderDate: new Date('2024-09-08T10:48:00'),
      createdAt: new Date('2024-09-08T10:48:00'),
    },
    {
      customerId: customerRecords[8].id,
      totalPrice: 1730298,
      items: [{ productId: product1.id, qty: 2, totalPrice: 1730298 }],
      orderDate: new Date('2024-09-08T10:43:00'),
      createdAt: new Date('2024-09-08T10:43:00'),
    },
    {
      customerId: customerRecords[9].id,
      totalPrice: 4910332,
      items: [{ productId: product1.id, qty: 1, totalPrice: 4910332 }],
      orderDate: new Date('2024-09-08T10:48:00'),
      createdAt: new Date('2024-09-08T10:48:00'),
    },
  ];

  await Promise.all(
    orders.map(order =>
      prisma.order.create({
        data: {
          customer_id: order.customerId,
          total_price: order.totalPrice,
          order_date: order.orderDate,
          created_at: order.createdAt,
          items: {
            create: order.items.map(item => ({
              product_id: item.productId,
              qty: item.qty,
              total_price: item.totalPrice,
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
