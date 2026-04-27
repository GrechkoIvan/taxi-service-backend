import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DriverOrdersController } from './driver-orders.controller';
import { OrdersService } from '../orders.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('DriverOrdersController', () => {
  let controller: DriverOrdersController;
  let ordersService: { findAvailable: jest.Mock; getDriverHistory: jest.Mock };

  beforeEach(async () => {
    ordersService = {
      findAvailable: jest.fn(),
      getDriverHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverOrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    controller = module.get<DriverOrdersController>(DriverOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvailable', () => {
    it('should return available orders', async () => {
      const user: AuthenticatedUser = {
        sub: 4,
        email: 'driver@test.by',
        role: 'driver',
      };
      const result = [{ id: 1 }, { id: 2 }];
      ordersService.findAvailable.mockResolvedValue(result);

      await expect(controller.getAvailable(user)).resolves.toEqual(result);
      expect(ordersService.findAvailable).toHaveBeenCalledWith(user.sub);
    });

    it('should throw ForbiddenException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 4,
        email: 'driver@test.by',
        role: 'driver',
      };
      ordersService.findAvailable.mockRejectedValueOnce(
        new ForbiddenException('Access denied'),
      );

      await expect(controller.getAvailable(user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getHistory', () => {
    it('should return driver history', async () => {
      const user: AuthenticatedUser = {
        sub: 4,
        email: 'driver@test.by',
        role: 'driver',
      };
      const query: PaginationQueryDto = { page: 2, limit: 5 };
      const result = { data: [], meta: { total: 0 } };
      ordersService.getDriverHistory.mockResolvedValue(result);

      await expect(controller.getHistory(user, query)).resolves.toEqual(result);
      expect(ordersService.getDriverHistory).toHaveBeenCalledWith(
        user.sub,
        query,
      );
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 4,
        email: 'driver@test.by',
        role: 'driver',
      };
      const query: PaginationQueryDto = { page: 2, limit: 5 };
      ordersService.getDriverHistory.mockRejectedValueOnce(
        new BadRequestException('Invalid pagination'),
      );

      await expect(controller.getHistory(user, query)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
