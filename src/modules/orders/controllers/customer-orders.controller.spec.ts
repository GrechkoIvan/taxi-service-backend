import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CustomerOrdersController } from './customer-orders.controller';
import { OrdersService } from '../orders.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('CustomerOrdersController', () => {
  let controller: CustomerOrdersController;
  let ordersService: { getCustomerHistory: jest.Mock };

  beforeEach(async () => {
    ordersService = {
      getCustomerHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerOrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    controller = module.get<CustomerOrdersController>(CustomerOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHistory', () => {
    it('should return customer history', async () => {
      const user: AuthenticatedUser = {
        sub: 3,
        email: 'customer@test.by',
        role: 'customer',
      };
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const result = { data: [], meta: { total: 0 } };
      ordersService.getCustomerHistory.mockResolvedValue(result);

      await expect(controller.getHistory(user, query)).resolves.toEqual(result);
      expect(ordersService.getCustomerHistory).toHaveBeenCalledWith(
        user.sub,
        query,
      );
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 3,
        email: 'customer@test.by',
        role: 'customer',
      };
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      ordersService.getCustomerHistory.mockRejectedValueOnce(
        new BadRequestException('Invalid pagination'),
      );

      await expect(controller.getHistory(user, query)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
