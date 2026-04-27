// src/modules/orders/orders.service.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { AuthenticatedUser } from '../../common/types/authenticated-user.interface';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import {
  getPaginationOptions,
  paginate,
  PaginateResult,
} from '../../common/utils/pagination.utils';
import { Order, Prisma } from '../../generated/prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Создание заказа
  async create(dto: CreateOrderDto, customerId: number): Promise<Order> {
    // Заглушка цены: позже здесь будет расчёт на основе расстояния
    const price = 0;
    const distance = 0; // заглушка

    return this.prisma.order.create({
      data: {
        customerId,
        pickupAddress: dto.pickupAddress,
        pickupLatitude: dto.pickupLatitude,
        pickupLongitude: dto.pickupLongitude,
        dropoffAddress: dto.dropoffAddress,
        dropoffLatitude: dto.dropoffLatitude,
        dropoffLongitude: dto.dropoffLongitude,
        comfortLevel: dto.comfortLevel,
        distanceMeters: distance,
        priceByn: price,
        status: 'searchingDriver',
      },
    });
  }

  // Текущий заказ для роли
  async getCurrent(user: AuthenticatedUser): Promise<Order | null> {
    const where: Prisma.OrderWhereInput = {};
    if (user.role === 'customer') {
      where.customerId = user.sub;
    } else if (user.role === 'driver') {
      const driver = await this.prisma.driverProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!driver) return null;
      where.driverId = driver.id;
    } else {
      return null; // manager не имеет активного заказа
    }
    // Ищем не завершённый/отменённый
    where.status = { notIn: ['finished', 'canceled'] };
    return this.prisma.order.findFirst({ where });
  }

  // Получение конкретного заказа с проверкой прав
  async findById(orderId: number, user: AuthenticatedUser): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'manager') return order;

    if (user.role === 'customer' && order.customerId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }
    if (user.role === 'driver') {
      const driver = await this.prisma.driverProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!driver || order.driverId !== driver.id) {
        throw new ForbiddenException('Access denied');
      }
    }
    return order;
  }

  // Обновление статуса с проверками ролей
  async updateStatus(
    orderId: number,
    dto: UpdateOrderStatusDto,
    user: AuthenticatedUser,
  ): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    // --- 1. Проверка прав клиента ---
    if (user.role === 'customer') {
      if (order.customerId !== user.sub) {
        throw new ForbiddenException('Access denied');
      }
      // Клиент может только отменять
      if (dto.status !== 'canceled') {
        throw new BadRequestException('Customer can only cancel an order');
      }
      // Отмена разрешена только из статусов, когда поездка ещё не началась
      if (order.status !== 'searchingDriver') {
        throw new BadRequestException('Order can no longer be canceled');
      }
    }

    // --- 2. Проверка прав водителя ---
    if (user.role === 'driver') {
      const driver = await this.prisma.driverProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!driver) throw new ForbiddenException('Driver profile not found');

      // Разрешаем только статусы, которые может устанавливать водитель
      if (!['driverAssigned', 'inProgress', 'finished'].includes(dto.status)) {
        throw new BadRequestException('Invalid driver status transition');
      }

      // Проверяем допустимость перехода в зависимости от текущего статуса
      switch (order.status) {
        case 'searchingDriver':
          if (dto.status !== 'driverAssigned') {
            throw new BadRequestException('You can only accept the order');
          }
          // При приёме заказ не должен быть уже кому-то назначен
          if (order.driverId !== null) {
            throw new BadRequestException('Order is already assigned');
          }
          break;
        case 'driverAssigned':
          if (dto.status !== 'inProgress') {
            throw new BadRequestException('You can only start the ride');
          }
          // Водитель должен быть тем, кому назначен заказ
          if (order.driverId !== driver.id) {
            throw new ForbiddenException('Access denied');
          }
          break;
        case 'inProgress':
          if (dto.status !== 'finished') {
            throw new BadRequestException('You can only finish the ride');
          }
          // Водитель должен совпадать
          if (order.driverId !== driver.id) {
            throw new ForbiddenException('Access denied');
          }
          break;
        default:
          // finished, canceled – менять нельзя
          throw new BadRequestException('Order cannot be updated');
      }
    }

    // --- 3. Формируем объект обновления ---
    const data: Prisma.OrderUncheckedUpdateInput = { status: dto.status };

    if (dto.status === 'driverAssigned') {
      // При назначении фиксируем водителя и время принятия
      const driver = await this.prisma.driverProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!driver) throw new ForbiddenException('Driver profile not found');
      data.driverId = driver.id;
      data.acceptedAt = new Date();
    } else if (dto.status === 'inProgress') {
      // acceptedAt должно быть уже заполнено, но если вдруг нет — подстрахуем
      if (!order.acceptedAt) {
        data.acceptedAt = new Date();
      }
    } else if (dto.status === 'finished') {
      data.finishedAt = new Date();
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data,
    });
  }
  // Доступные заказы для водителя
  async findAvailable(driverUserId: number): Promise<Order[]> {
    const driver = await this.prisma.driverProfile.findUnique({
      where: { userId: driverUserId },
    });
    if (!driver) return [];
    return this.prisma.order.findMany({
      where: {
        status: 'searchingDriver',
        comfortLevel: driver.comfortLevel ?? undefined, // если у водителя нет уровня, пропустим
      },
    });
  }

  // История заказов клиента (с пагинацией)
  async getCustomerHistory(
    customerId: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginateResult<Order>> {
    const { offset, limit } = getPaginationOptions(paginationQuery);
    const where: Prisma.OrderWhereInput = { customerId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return paginate(data, total, { offset, limit });
  }

  // История заказов водителя
  async getDriverHistory(
    driverUserId: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginateResult<Order>> {
    const driver = await this.prisma.driverProfile.findUnique({
      where: { userId: driverUserId },
    });
    if (!driver)
      return {
        data: [],
        meta: { total: 0, offset: 0, limit: 10, hasMore: false },
      };
    const { offset, limit } = getPaginationOptions(paginationQuery);
    const where: Prisma.OrderWhereInput = { driverId: driver.id };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return paginate(data, total, { offset, limit });
  }

  // Публичная информация о водителе для клиента (только при наличии заказа)
  async getDriverPublicInfo(driverId: number, customerUserId: number) {
    const driverProfile = await this.prisma.driverProfile.findUnique({
      where: { id: driverId },
      include: { user: { select: { name: true, phone: true } }, cars: true },
    });
    if (!driverProfile) throw new NotFoundException('Driver not found');

    // Проверим, что у клиента с этим водителем есть активный или завершённый заказ
    const order = await this.prisma.order.findFirst({
      where: {
        driverId,
        customerId: customerUserId,
        status: { in: ['finished', 'inProgress', 'driverAssigned'] },
      },
    });
    if (!order)
      throw new ForbiddenException('No active order with this driver');
    return driverProfile;
  }

  // Публичная информация о клиенте для водителя
  async getCustomerPublicInfo(customerId: number, driverUserId: number) {
    const customer = await this.prisma.user.findUnique({
      where: { id: customerId },
      select: { name: true, phone: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    const driver = await this.prisma.driverProfile.findUnique({
      where: { userId: driverUserId },
    });
    if (!driver) throw new ForbiddenException('Not a driver');

    const order = await this.prisma.order.findFirst({
      where: {
        customerId,
        driverId: driver.id,
        status: { in: ['driverAssigned', 'inProgress'] }, // активный заказ
      },
    });
    if (!order)
      throw new ForbiddenException('No active order with this customer');
    return customer;
  }
}
