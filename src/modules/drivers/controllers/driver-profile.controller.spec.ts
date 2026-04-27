import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DriverProfileController } from './driver-profile.controller';
import { UsersService } from '../../users/users.service';
import { UpdateDriverStatusDto } from '../dtos/update-driver-status.dto';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('DriverProfileController', () => {
  let controller: DriverProfileController;
  let usersService: { setOnlineStatus: jest.Mock };

  beforeEach(async () => {
    usersService = {
      setOnlineStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverProfileController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<DriverProfileController>(DriverProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateStatus', () => {
    it('should update driver status', async () => {
      const user: AuthenticatedUser = {
        sub: 5,
        email: 'driver@test.by',
        role: 'driver',
      };
      const dto: UpdateDriverStatusDto = { isOnline: true };
      const result = { userId: 5, isOnline: true };
      usersService.setOnlineStatus.mockResolvedValue(result);

      await expect(controller.updateStatus(user, dto)).resolves.toEqual(result);
      expect(usersService.setOnlineStatus).toHaveBeenCalledWith(
        user.sub,
        dto.isOnline,
      );
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 5,
        email: 'driver@test.by',
        role: 'driver',
      };
      const dto: UpdateDriverStatusDto = { isOnline: true };
      usersService.setOnlineStatus.mockRejectedValueOnce(
        new BadRequestException('Only drivers can change status'),
      );

      await expect(controller.updateStatus(user, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
