import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Очистка таблиц
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.driverApplication.deleteMany();
  await prisma.car.deleteMany();
  await prisma.driverProfile.deleteMany();
  await prisma.userCredential.deleteMany();
  await prisma.user.deleteMany();

  // Users
  await prisma.user.create({
    data: {
      id: 1,
      name: 'Иван',
      phone: '+375291234567',
      role: 'customer',
      createdAt: new Date('2025-12-01T10:00:00'),
      updatedAt: new Date('2025-12-01T10:00:00'),
    },
  });
  await prisma.user.create({
    data: {
      id: 2,
      name: 'Петр',
      phone: '+375292222222',
      role: 'customer',
      createdAt: new Date('2025-12-02T11:00:00'),
      updatedAt: new Date('2025-12-02T11:00:00'),
    },
  });
  await prisma.user.create({
    data: {
      id: 3,
      name: 'Иванов Иван Иванович',
      phone: '+375339876543',
      role: 'driver',
      createdAt: new Date('2025-12-03T12:00:00'),
      updatedAt: new Date('2025-12-03T12:00:00'),
    },
  });
  await prisma.user.create({
    data: {
      id: 4,
      name: 'Менеджер',
      phone: '+375293333333',
      role: 'manager',
      createdAt: new Date('2025-12-04T13:00:00'),
      updatedAt: new Date('2025-12-04T13:00:00'),
    },
  });
  await prisma.user.create({
    data: {
      id: 5,
      name: 'Петр Петров Петрович',
      phone: '+375291111111',
      role: 'driver',
      createdAt: new Date('2025-12-05T14:00:00'),
      updatedAt: new Date('2025-12-05T14:00:00'),
    },
  });

  // Driver profiles
  await prisma.driverProfile.create({
    data: {
      id: 1,
      userId: 3,
      comfortLevel: 'business',
      driverLicense: 'MP1234567',
      updatedAt: new Date(),
    },
  });
  await prisma.driverProfile.create({
    data: {
      id: 2,
      userId: 5,
      comfortLevel: 'economy',
      driverLicense: 'ABC123456',
      updatedAt: new Date(),
    },
  });

  // Cars
  await prisma.car.create({
    data: {
      id: 1,
      driverId: 1,
      make: 'BMW',
      model: '7 Series',
      color: 'Черный',
      number: '1234 AB-7',
    },
  });
  await prisma.car.create({
    data: {
      id: 2,
      driverId: 2,
      make: 'Toyota',
      model: 'Camry',
      color: 'Белый',
      number: '5678 CD-7',
    },
  });

  // Driver applications
  await prisma.driverApplication.create({
    data: {
      id: 1,
      email: 'businessdriver@test.by',
      name: 'Иванов Иван Иванович',
      phone: '+375339876543',
      driverLicense: 'MP1234567',
      carMake: 'BMW',
      carModel: '7 Series',
      carColor: 'Черный',
      carNumber: '1234 AB-7',
      comfortLevel: 'business',
      status: 'approved',
      comment: null,
      reviewedBy: 4,
      reviewedAt: new Date('2025-12-16T22:21:14'),
      driverId: 1,
      createdAt: new Date('2025-12-16T22:14:22'),
    },
  });
  await prisma.driverApplication.create({
    data: {
      id: 2,
      email: 'businessdriver2@test.by',
      name: 'Петр Петров Петрович',
      phone: '+375291111111',
      driverLicense: null,
      carMake: null,
      carModel: null,
      carColor: null,
      carNumber: null,
      comfortLevel: null,
      status: 'pending',
      comment: null,
      reviewedBy: null,
      reviewedAt: null,
      driverId: null,
      createdAt: new Date('2025-12-30T05:39:37'),
    },
  });

  // Orders
  await prisma.order.create({
    data: {
      id: 1,
      customerId: 2,
      driverId: 1,
      pickupAddress: 'Витебск, Октябрьский район',
      pickupLatitude: 55.19233559178408,
      pickupLongitude: 30.214990131979473,
      dropoffAddress: 'Витебск, 1-я Стадионная улица, 18',
      dropoffLatitude: 55.20190449642146,
      dropoffLongitude: 30.237021461082445,
      comfortLevel: 'business',
      distanceMeters: 2236,
      durationSec: 293,
      priceByn: 10.2,
      status: 'finished',
      createdAt: new Date('2025-12-16T22:13:29'),
      updatedAt: new Date('2025-12-16T22:25:23'),
      acceptedAt: new Date('2025-12-16T22:23:13'),
      finishedAt: new Date('2025-12-16T22:25:23'),
    },
  });
  await prisma.order.create({
    data: {
      id: 2,
      customerId: 1,
      driverId: 1,
      pickupAddress: 'Витебск, Московский проспект, 33',
      pickupLatitude: 55.177792,
      pickupLongitude: 30.225578,
      dropoffAddress: 'Витебск, улица Ленина',
      dropoffLatitude: 55.19137329222349,
      dropoffLongitude: 30.20634528633608,
      comfortLevel: 'business',
      distanceMeters: 2760,
      durationSec: 349,
      priceByn: 11.3,
      status: 'finished',
      createdAt: new Date('2025-12-19T20:34:10'),
      updatedAt: new Date('2025-12-19T20:42:55'),
      acceptedAt: new Date('2025-12-19T20:37:41'),
      finishedAt: new Date('2025-12-19T20:42:55'),
    },
  });
  await prisma.order.create({
    data: {
      id: 3,
      customerId: 1,
      driverId: 1,
      pickupAddress: 'Витебск, Московский проспект, 35',
      pickupLatitude: 55.177184612924385,
      pickupLongitude: 30.23175810368352,
      dropoffAddress: 'Витебск, Московский проспект, 33',
      dropoffLatitude: 55.177792,
      dropoffLongitude: 30.225578,
      comfortLevel: 'business',
      distanceMeters: 1680,
      durationSec: 308,
      priceByn: 9.03,
      status: 'finished',
      createdAt: new Date('2025-12-20T11:22:37'),
      updatedAt: new Date('2025-12-20T11:23:28'),
      acceptedAt: new Date('2025-12-20T11:23:06'),
      finishedAt: new Date('2025-12-20T11:23:28'),
    },
  });
  await prisma.order.create({
    data: {
      id: 4,
      customerId: 1,
      driverId: 1,
      pickupAddress: 'Витебск, улица Труда, 4',
      pickupLatitude: 55.19468944111698,
      pickupLongitude: 30.216642520484932,
      dropoffAddress: 'Витебск, проспект Фрунзе, 27',
      dropoffLatitude: 55.19262109843675,
      dropoffLongitude: 30.218648812828075,
      comfortLevel: 'business',
      distanceMeters: 688,
      durationSec: 124,
      priceByn: 6.95,
      status: 'finished',
      createdAt: new Date('2025-12-29T21:52:39'),
      updatedAt: new Date('2025-12-29T21:53:38'),
      acceptedAt: new Date('2025-12-29T21:53:11'),
      finishedAt: new Date('2025-12-29T21:53:38'),
    },
  });
  await prisma.order.create({
    data: {
      id: 5,
      customerId: 1,
      driverId: 1,
      pickupAddress: 'Витебск, 1-я улица Доватора, 3Б',
      pickupLatitude: 55.19608224694726,
      pickupLongitude: 30.213926134902852,
      dropoffAddress: 'Витебск, проспект Фрунзе, 23к1',
      dropoffLatitude: 55.19255323456357,
      dropoffLongitude: 30.217294989425564,
      comfortLevel: 'business',
      distanceMeters: 704,
      durationSec: 121,
      priceByn: 6.98,
      status: 'finished',
      createdAt: new Date('2025-12-29T21:54:21'),
      updatedAt: new Date('2025-12-29T22:07:47'),
      acceptedAt: new Date('2025-12-29T21:54:39'),
      finishedAt: new Date('2025-12-29T22:07:47'),
    },
  });
  await prisma.order.create({
    data: {
      id: 6,
      customerId: 1,
      driverId: 1,
      pickupAddress: 'Витебск, 2-я улица Фрунзе',
      pickupLatitude: 55.19391146838614,
      pickupLongitude: 30.214234595878448,
      dropoffAddress: 'Витебск, проспект Фрунзе, 23',
      dropoffLatitude: 55.192340243475726,
      dropoffLongitude: 30.21650910912309,
      comfortLevel: 'business',
      distanceMeters: 658,
      durationSec: 142,
      priceByn: 6.88,
      status: 'finished',
      createdAt: new Date('2025-12-29T22:08:02'),
      updatedAt: new Date('2025-12-29T22:39:13'),
      acceptedAt: new Date('2025-12-29T22:08:18'),
      finishedAt: new Date('2025-12-29T22:39:13'),
    },
  });
  await prisma.order.create({
    data: {
      id: 7,
      customerId: 1,
      driverId: 1,
      pickupAddress: 'Витебск, 1-я улица Доватора, 3А',
      pickupLatitude: 55.19410604841602,
      pickupLongitude: 30.21393152878088,
      dropoffAddress: 'Витебск, проспект Фрунзе, 23к1',
      dropoffLatitude: 55.19251028045218,
      dropoffLongitude: 30.217107264254516,
      comfortLevel: 'business',
      distanceMeters: 1090,
      durationSec: 207,
      priceByn: 7.79,
      status: 'finished',
      createdAt: new Date('2025-12-29T22:40:27'),
      updatedAt: new Date('2025-12-29T23:41:10'),
      acceptedAt: new Date('2025-12-29T22:41:31'),
      finishedAt: new Date('2025-12-29T23:41:10'),
    },
  });
  await prisma.order.create({
    data: {
      id: 8,
      customerId: 2,
      driverId: null,
      pickupAddress: 'Витебск, улица Гагарина, 1',
      pickupLatitude: 55.20543569041782,
      pickupLongitude: 30.216373910003625,
      dropoffAddress: 'Витебск, проспект Фрунзе, 49',
      dropoffLatitude: 55.19340671915832,
      dropoffLongitude: 30.231723332391674,
      comfortLevel: 'business',
      distanceMeters: 2369,
      durationSec: 245,
      priceByn: 10.47,
      status: 'canceled',
      createdAt: new Date('2025-12-16T22:12:11'),
      updatedAt: new Date('2025-12-16T22:12:11'),
      acceptedAt: null,
      finishedAt: null,
    },
  });

  // Reviews
  await prisma.review.create({
    data: {
      id: 1,
      orderId: 2,
      rating: 5,
      comment:
        'Отличная поездка, водитель был очень вежлив и полностью оправдал бизнес комфорт',
    },
  });
  await prisma.review.create({
    data: {
      id: 2,
      orderId: 1,
      rating: 4,
      comment: 'В целом норм, но салон был недостаточно ухожен',
    },
  });
  await prisma.review.create({
    data: { id: 3, orderId: 3, rating: 5, comment: 'Все отлично' },
  });
  await prisma.review.create({
    data: { id: 4, orderId: 4, rating: 5, comment: null },
  });
  await prisma.review.create({
    data: { id: 5, orderId: 5, rating: 5, comment: null },
  });
  await prisma.review.create({
    data: { id: 6, orderId: 6, rating: 5, comment: null },
  });
  await prisma.review.create({
    data: {
      id: 7,
      orderId: 7,
      rating: 5,
      comment: 'Все по красоте прошло, как всегда отлично',
    },
  });

  // User credentials
  await prisma.userCredential.create({
    data: {
      id: 1,
      userId: 1,
      email: 'usermail@test.by',
      password: '$2b$10$VV6LrIVgoRxOwbDk0/O/yu6.zuiVU9phdqS/lncdg0BR//t8hI2AG',
      updatedAt: new Date(),
    },
  });
  await prisma.userCredential.create({
    data: {
      id: 2,
      userId: 2,
      email: 'user2mail@test.by',
      password: '$2b$10$VV6LrIVgoRxOwbDk0/O/yu6.zuiVU9phdqS/lncdg0BR//t8hI2AG',
      updatedAt: new Date(),
    },
  });
  await prisma.userCredential.create({
    data: {
      id: 3,
      userId: 3,
      email: 'businessdriver@test.by',
      password: '$2b$10$VV6LrIVgoRxOwbDk0/O/yu6.zuiVU9phdqS/lncdg0BR//t8hI2AG',
      updatedAt: new Date(),
    },
  });
  await prisma.userCredential.create({
    data: {
      id: 4,
      userId: 4,
      email: 'manager@test.by',
      password: '$2b$10$938zZAMhh9L5mhf5ctMVmOwjXkLWY2914hVXLDcMd0vsFaC1XLDqO',
      updatedAt: new Date(),
    },
  });
  await prisma.userCredential.create({
    data: {
      id: 5,
      userId: 5,
      email: 'businessdriver2@test.by',
      password: '$2b$10$VV6LrIVgoRxOwbDk0/O/yu6.zuiVU9phdqS/lncdg0BR//t8hI2AG',
      updatedAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
