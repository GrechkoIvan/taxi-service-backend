import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ApplicationStatus,
  ManagerDriverApplicationsController,
} from './manager-driver-applications.controller';
import { DriverApplicationService } from '../drivers/driver-application.service';
import { ProcessApplicationDto } from './dtos/process-application.dto';
import { AuthenticatedUser } from '../../common/types/authenticated-user.interface';

jest.mock('../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('ManagerDriverApplicationsController', () => {
  let controller: ManagerDriverApplicationsController;
  let appService: {
    findAll: jest.Mock;
    findById: jest.Mock;
    processApplication: jest.Mock;
  };

  beforeEach(async () => {
    appService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      processApplication: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerDriverApplicationsController],
      providers: [{ provide: DriverApplicationService, useValue: appService }],
    }).compile();

    controller = module.get<ManagerDriverApplicationsController>(
      ManagerDriverApplicationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return applications', async () => {
      const result = [{ id: 1 }, { id: 2 }];
      appService.findAll.mockResolvedValue(result);

      await expect(
        controller.findAll(ApplicationStatus.pending),
      ).resolves.toEqual(result);
      expect(appService.findAll).toHaveBeenCalledWith(
        ApplicationStatus.pending,
      );
    });

    it('should throw BadRequestException if service throws', async () => {
      appService.findAll.mockRejectedValueOnce(
        new BadRequestException('Invalid status'),
      );

      await expect(
        controller.findAll(ApplicationStatus.pending),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return application', async () => {
      const result = { id: 1 };
      appService.findById.mockResolvedValue(result);

      await expect(controller.findOne(1)).resolves.toEqual(result);
      expect(appService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if service throws', async () => {
      appService.findById.mockRejectedValueOnce(
        new NotFoundException('Application not found'),
      );

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('process', () => {
    it('should process application', async () => {
      const user: AuthenticatedUser = {
        sub: 10,
        email: 'manager@test.by',
        role: 'manager',
      };
      const dto: ProcessApplicationDto = { action: 'reject', comment: 'Nope' };
      const result = { id: 1, status: 'rejected' };
      appService.processApplication.mockResolvedValue(result);

      await expect(controller.process(1, dto, user)).resolves.toEqual(result);
      expect(appService.processApplication).toHaveBeenCalledWith(
        1,
        dto,
        user.sub,
      );
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 10,
        email: 'manager@test.by',
        role: 'manager',
      };
      const dto: ProcessApplicationDto = { action: 'reject', comment: 'Nope' };
      appService.processApplication.mockRejectedValueOnce(
        new BadRequestException('Already processed'),
      );

      await expect(controller.process(1, dto, user)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
