import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { Express } from 'express';
import type {
  LoginResponse,
  OrderResponse,
  DriverApplicationResponse,
} from './e2e-types';

describe('Такси-сервис (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: Express;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Очистка
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.driverApplication.deleteMany();
    await prisma.car.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.userCredential.deleteMany();
    await prisma.user.deleteMany();

    const hash = await bcrypt.hash('password123', 10);

    // Клиент
    await prisma.user.create({
      data: {
        name: 'Клиент',
        phone: '+3751111111',
        role: 'customer',
        credentials: {
          create: { email: 'customer@test.test', password: hash },
        },
      },
    });

    // Водитель
    const driver = await prisma.user.create({
      data: {
        name: 'Водитель',
        phone: '+3752222222',
        role: 'driver',
        credentials: { create: { email: 'driver@test.test', password: hash } },
      },
    });
    await prisma.driverProfile.create({
      data: {
        userId: driver.id,
        comfortLevel: 'business',
        driverLicense: 'DL123',
      },
    });

    // Менеджер
    await prisma.user.create({
      data: {
        name: 'Менеджер',
        phone: '+3753333333',
        role: 'manager',
        credentials: { create: { email: 'manager@test.test', password: hash } },
      },
    });

    server = app.getHttpServer() as unknown as Express;
  }, 30000);

  afterAll(async () => {
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.driverApplication.deleteMany();
    await prisma.car.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.userCredential.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  const loginAs = async (email: string, role: string): Promise<string> => {
    const res = await request(server)
      .post('/auth/login')
      .send({ email, password: 'password123', role })
      .expect(201);
    const body = res.body as LoginResponse;
    return body.access_token;
  };

  // ------------------ СЦЕНАРИЙ 1 ------------------
  describe('Полный цикл заказа', () => {
    it('создание, принятие, завершение, отзыв', async () => {
      const custToken = await loginAs('customer@test.test', 'customer');
      const drvToken = await loginAs('driver@test.test', 'driver');

      // Создание заказа
      const created = await request(server)
        .post('/orders')
        .set('Authorization', `Bearer ${custToken}`)
        .send({
          pickupAddress: 'ул. Ленина',
          dropoffAddress: 'пр. Победы',
          comfortLevel: 'business',
        })
        .expect(201);
      const order = created.body as OrderResponse;
      expect(order.status).toBe('searchingDriver');

      // Доступные заказы водителю
      const avail = await request(server)
        .get('/drivers/orders/available')
        .set('Authorization', `Bearer ${drvToken}`)
        .expect(200);
      const availOrders = avail.body as OrderResponse[];
      expect(availOrders.some((o) => o.id === order.id)).toBe(true);

      // Принятие
      await request(server)
        .patch(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${drvToken}`)
        .send({ status: 'driverAssigned' })
        .expect(200);

      // Начало поездки
      await request(server)
        .patch(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${drvToken}`)
        .send({ status: 'inProgress' })
        .expect(200);

      // Завершение
      await request(server)
        .patch(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${drvToken}`)
        .send({ status: 'finished' })
        .expect(200);

      // Отзыв
      const reviewRes = await request(server)
        .post(`/orders/${order.id}/review`)
        .set('Authorization', `Bearer ${custToken}`)
        .send({ rating: 5, comment: 'Отлично' })
        .expect(201);
      expect((reviewRes.body as { rating: number }).rating).toBe(5);
    });
  });

  // ------------------ СЦЕНАРИЙ 2 ------------------
  describe('Обработка заявки водителя менеджером', () => {
    it('подача → одобрение → вход', async () => {
      // Подача заявки
      const appRes = await request(server)
        .post('/driver-applications')
        .send({
          email: 'newdriver@test.test',
          password: 'password123',
          name: 'Новый Водитель',
          phone: '+3755555555',
        })
        .expect(201);
      const application = appRes.body as DriverApplicationResponse;
      expect(application.status).toBe('pending');

      // Менеджер логинится и одобряет
      const mgrToken = await loginAs('manager@test.test', 'manager');
      await request(server)
        .patch(`/manager/driver-applications/${application.id}`)
        .set('Authorization', `Bearer ${mgrToken}`)
        .send({
          action: 'approve',
          driverLicenseNumber: 'DL654321',
          carMake: 'Audi',
          carModel: 'A6',
          carColor: 'Чёрный',
          carPlate: 'A111AA',
          comfortLevel: 'comfort',
        })
        .expect(200);

      // Новый водитель может войти
      const loginRes = await request(server)
        .post('/auth/login')
        .send({
          email: 'newdriver@test.test',
          password: 'password123',
          role: 'driver',
        })
        .expect(201);
      expect((loginRes.body as LoginResponse).access_token).toBeDefined();
    });
  });
});
