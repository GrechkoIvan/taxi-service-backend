import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PublicInfoController } from './public-info.controller';
import { OrdersService } from '../orders.service';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('PublicInfoController', () => {
  let controller: PublicInfoController;
  let ordersService: {
    getDriverPublicInfo: jest.Mock;
    getCustomerPublicInfo: jest.Mock;
  };

  beforeEach(async () => {
    ordersService = {
      getDriverPublicInfo: jest.fn(),
      getCustomerPublicInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicInfoController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    controller = module.get<PublicInfoController>(PublicInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDriverInfo', () => {
    it('should return driver public info', async () => {
      const user: AuthenticatedUser = {
        sub: 11,
        email: 'customer@test.by',
        role: 'customer',
      };
      const result = { id: 7, name: 'Driver' };
      ordersService.getDriverPublicInfo.mockResolvedValue(result);

      await expect(controller.getDriverInfo(7, user)).resolves.toEqual(result);
      expect(ordersService.getDriverPublicInfo).toHaveBeenCalledWith(
        7,
        user.sub,
      );
    });

    it('should throw NotFoundException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 11,
        email: 'customer@test.by',
        role: 'customer',
      };
      ordersService.getDriverPublicInfo.mockRejectedValueOnce(
        new NotFoundException('Driver not found'),
      );

      await expect(controller.getDriverInfo(7, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCustomerInfo', () => {
    it('should return customer public info', async () => {
      const user: AuthenticatedUser = {
        sub: 12,
        email: 'driver@test.by',
        role: 'driver',
      };
      const result = { id: 9, name: 'Customer' };
      ordersService.getCustomerPublicInfo.mockResolvedValue(result);

      await expect(controller.getCustomerInfo(9, user)).resolves.toEqual(
        result,
      );
      expect(ordersService.getCustomerPublicInfo).toHaveBeenCalledWith(
        9,
        user.sub,
      );
    });

    it('should throw NotFoundException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 12,
        email: 'driver@test.by',
        role: 'driver',
      };
      ordersService.getCustomerPublicInfo.mockRejectedValueOnce(
        new NotFoundException('Customer not found'),
      );

      await expect(controller.getCustomerInfo(9, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
