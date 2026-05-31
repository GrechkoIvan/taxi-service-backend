import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomerReviewsController } from './customer-reviews.controller';
import { ReviewsService } from '../reviews.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('CustomerReviewsController', () => {
  let controller: CustomerReviewsController;
  let reviewsService: { create: jest.Mock; getByOrderId: jest.Mock };

  beforeEach(async () => {
    reviewsService = {
      create: jest.fn(),
      getByOrderId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerReviewsController],
      providers: [{ provide: ReviewsService, useValue: reviewsService }],
    }).compile();

    controller = module.get<CustomerReviewsController>(
      CustomerReviewsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReview', () => {
    it('should create review', async () => {
      const user: AuthenticatedUser = {
        sub: 20,
        email: 'customer@test.by',
        role: 'customer',
      };
      const dto: CreateReviewDto = { rating: 5, comment: 'Great' };
      const result = { id: 1, rating: 5 };
      reviewsService.create.mockResolvedValue(result);

      await expect(controller.createReview(101, dto, user)).resolves.toEqual(
        result,
      );
      expect(reviewsService.create).toHaveBeenCalledWith(101, user.sub, dto);
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 20,
        email: 'customer@test.by',
        role: 'customer',
      };
      const dto: CreateReviewDto = { rating: 5, comment: 'Great' };
      reviewsService.create.mockRejectedValueOnce(
        new BadRequestException('Review already exists'),
      );

      await expect(controller.createReview(101, dto, user)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getReview', () => {
    it('should return review', async () => {
      const user: AuthenticatedUser = {
        sub: 21,
        email: 'customer@test.by',
        role: 'customer',
      };
      const result = { id: 2, rating: 4 };
      reviewsService.getByOrderId.mockResolvedValue(result);

      await expect(controller.getReview(102, user)).resolves.toEqual(result);
      expect(reviewsService.getByOrderId).toHaveBeenCalledWith(102, user);
    });

    it('should throw NotFoundException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 21,
        email: 'customer@test.by',
        role: 'customer',
      };
      reviewsService.getByOrderId.mockRejectedValueOnce(
        new NotFoundException('Order not found'),
      );

      await expect(controller.getReview(102, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
