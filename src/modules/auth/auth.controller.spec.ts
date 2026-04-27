import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterCustomerDto } from './dtos/register-customer.dto';
import { UserRole } from '../../generated/prisma/client';

jest.mock('../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { registerCustomer: jest.Mock; login: jest.Mock };

  beforeEach(async () => {
    authService = {
      registerCustomer: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerCustomer', () => {
    it('should return a token', async () => {
      const dto: RegisterCustomerDto = {
        email: 'test@test.by',
        password: 'password123',
        name: 'Test User',
        phone: '+375291234567',
      };
      const result = { access_token: 'token' };
      authService.registerCustomer.mockResolvedValue(result);

      await expect(controller.registerCustomer(dto)).resolves.toEqual(result);
      expect(authService.registerCustomer).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if service throws', async () => {
      const dto: RegisterCustomerDto = {
        email: 'test@test.by',
        password: 'password123',
        name: 'Test User',
        phone: '+375291234567',
      };
      authService.registerCustomer.mockRejectedValueOnce(
        new ConflictException('Email already exists'),
      );

      await expect(controller.registerCustomer(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const dto: LoginDto = {
        email: 'test@test.by',
        password: 'password123',
        role: UserRole.customer,
      };
      const result = { access_token: 'token' };
      authService.login.mockResolvedValue(result);

      await expect(controller.login(dto)).resolves.toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException if service throws', async () => {
      const dto: LoginDto = {
        email: 'test@test.by',
        password: 'password123',
        role: UserRole.customer,
      };
      authService.login.mockRejectedValueOnce(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should return a message', () => {
      expect(controller.logout()).toEqual({
        message: 'Logged out successfully',
      });
    });
  });
});
