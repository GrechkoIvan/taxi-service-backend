import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DriversApplicationController } from './drivers-application.controller';
import { DriverApplicationService } from '../driver-application.service';
import { CreateDriverApplicationDto } from '../dtos/create-driver-application.dto';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('DriversApplicationController', () => {
  let controller: DriversApplicationController;
  let appService: { createApplication: jest.Mock };

  beforeEach(async () => {
    appService = {
      createApplication: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversApplicationController],
      providers: [{ provide: DriverApplicationService, useValue: appService }],
    }).compile();

    controller = module.get<DriversApplicationController>(
      DriversApplicationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create application', async () => {
      const dto: CreateDriverApplicationDto = {
        email: 'driver@test.by',
        password: 'password123',
        name: 'Driver',
        phone: '+375291234567',
      };
      const result = { id: 1, email: dto.email };
      appService.createApplication.mockResolvedValue(result);

      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(appService.createApplication).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException if service throws', async () => {
      const dto: CreateDriverApplicationDto = {
        email: 'driver@test.by',
        password: 'password123',
        name: 'Driver',
        phone: '+375291234567',
      };
      appService.createApplication.mockRejectedValueOnce(
        new BadRequestException('Email already in use'),
      );

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
