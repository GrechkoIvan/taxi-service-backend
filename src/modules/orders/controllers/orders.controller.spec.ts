import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { ComfortLevel, OrderStatus } from '../../../generated/prisma/client';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: {
    create: jest.Mock;
    getCurrent: jest.Mock;
    findById: jest.Mock;
    updateStatus: jest.Mock;
  };

  beforeEach(async () => {
    ordersService = {
      create: jest.fn(),
      getCurrent: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const dto: CreateOrderDto = {
        pickupAddress: 'Address 1',
        dropoffAddress: 'Address 2',
        comfortLevel: ComfortLevel.economy,
      };
      const user: AuthenticatedUser = {
        sub: 1,
        email: 'customer@test.by',
        role: 'customer',
      };
      const result = { id: 101 };
      ordersService.create.mockResolvedValue(result);

      await expect(controller.create(dto, user)).resolves.toEqual(result);
      expect(ordersService.create).toHaveBeenCalledWith(dto, user.sub);
    });

    it('should throw BadRequestException if service throws', async () => {
      const dto: CreateOrderDto = {
        pickupAddress: 'Address 1',
        dropoffAddress: 'Address 2',
        comfortLevel: ComfortLevel.economy,
      };
      const user: AuthenticatedUser = {
        sub: 1,
        email: 'customer@test.by',
        role: 'customer',
      };
      ordersService.create.mockRejectedValueOnce(
        new BadRequestException('Invalid order data'),
      );

      await expect(controller.create(dto, user)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getCurrent', () => {
    it('should return current order', async () => {
      const user: AuthenticatedUser = {
        sub: 2,
        email: 'driver@test.by',
        role: 'driver',
      };
      const result = { id: 202 };
      ordersService.getCurrent.mockResolvedValue(result);

      await expect(controller.getCurrent(user)).resolves.toEqual(result);
      expect(ordersService.getCurrent).toHaveBeenCalledWith(user);
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 2,
        email: 'driver@test.by',
        role: 'driver',
      };
      ordersService.getCurrent.mockRejectedValueOnce(
        new BadRequestException('No current order'),
      );

      await expect(controller.getCurrent(user)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return order by id', async () => {
      const user: AuthenticatedUser = {
        sub: 1,
        email: 'customer@test.by',
        role: 'customer',
      };
      const result = { id: 303 };
      ordersService.findById.mockResolvedValue(result);

      await expect(controller.findOne(303, user)).resolves.toEqual(result);
      expect(ordersService.findById).toHaveBeenCalledWith(303, user);
    });

    it('should throw NotFoundException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 1,
        email: 'customer@test.by',
        role: 'customer',
      };
      ordersService.findById.mockRejectedValueOnce(
        new NotFoundException('Order not found'),
      );

      await expect(controller.findOne(303, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const user: AuthenticatedUser = {
        sub: 2,
        email: 'driver@test.by',
        role: 'driver',
      };
      const dto: UpdateOrderStatusDto = { status: OrderStatus.driverAssigned };
      const result = { id: 404, status: OrderStatus.driverAssigned };
      ordersService.updateStatus.mockResolvedValue(result);

      await expect(controller.updateStatus(404, dto, user)).resolves.toEqual(
        result,
      );
      expect(ordersService.updateStatus).toHaveBeenCalledWith(404, dto, user);
    });

    it('should throw ForbiddenException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 2,
        email: 'driver@test.by',
        role: 'driver',
      };
      const dto: UpdateOrderStatusDto = { status: OrderStatus.driverAssigned };
      ordersService.updateStatus.mockRejectedValueOnce(
        new ForbiddenException('Access denied'),
      );

      await expect(controller.updateStatus(404, dto, user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
