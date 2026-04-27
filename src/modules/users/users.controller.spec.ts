import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AuthenticatedUser } from '../../common/types/authenticated-user.interface';

jest.mock('../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: { getProfile: jest.Mock; updateProfile: jest.Mock };

  beforeEach(async () => {
    usersService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user profile', async () => {
      const user: AuthenticatedUser = {
        sub: 1,
        email: 'user@test.by',
        role: 'customer',
      };
      const result = { id: 1, name: 'Test User' };
      usersService.getProfile.mockResolvedValue(result);

      await expect(controller.getMe(user)).resolves.toEqual(result);
      expect(usersService.getProfile).toHaveBeenCalledWith(user.sub);
    });

    it('should throw NotFoundException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 1,
        email: 'user@test.by',
        role: 'customer',
      };
      usersService.getProfile.mockRejectedValueOnce(
        new NotFoundException('User not found'),
      );

      await expect(controller.getMe(user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMe', () => {
    it('should update profile', async () => {
      const user: AuthenticatedUser = {
        sub: 2,
        email: 'user2@test.by',
        role: 'driver',
      };
      const dto: UpdateProfileDto = { name: 'Updated', phone: '+375291111111' };
      const result = { id: 2, name: 'Updated' };
      usersService.updateProfile.mockResolvedValue(result);

      await expect(controller.updateMe(user, dto)).resolves.toEqual(result);
      expect(usersService.updateProfile).toHaveBeenCalledWith(user.sub, dto);
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 2,
        email: 'user2@test.by',
        role: 'driver',
      };
      const dto: UpdateProfileDto = { name: 'Updated', phone: '+375291111111' };
      usersService.updateProfile.mockRejectedValueOnce(
        new BadRequestException('Invalid data'),
      );

      await expect(controller.updateMe(user, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
