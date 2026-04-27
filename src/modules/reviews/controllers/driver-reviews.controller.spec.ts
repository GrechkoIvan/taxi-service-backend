import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DriverReviewsController } from './driver-reviews.controller';
import { ReviewsService } from '../reviews.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';

jest.mock('../../../core/prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

describe('DriverReviewsController', () => {
  let controller: DriverReviewsController;
  let reviewsService: { getDriverReviews: jest.Mock };

  beforeEach(async () => {
    reviewsService = {
      getDriverReviews: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverReviewsController],
      providers: [{ provide: ReviewsService, useValue: reviewsService }],
    }).compile();

    controller = module.get<DriverReviewsController>(DriverReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyReviews', () => {
    it('should return driver reviews', async () => {
      const user: AuthenticatedUser = {
        sub: 30,
        email: 'driver@test.by',
        role: 'driver',
      };
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const result = { data: [], meta: { total: 0 }, averageRating: null };
      reviewsService.getDriverReviews.mockResolvedValue(result);

      await expect(controller.getMyReviews(user, query)).resolves.toEqual(
        result,
      );
      expect(reviewsService.getDriverReviews).toHaveBeenCalledWith(
        user.sub,
        query,
      );
    });

    it('should throw BadRequestException if service throws', async () => {
      const user: AuthenticatedUser = {
        sub: 30,
        email: 'driver@test.by',
        role: 'driver',
      };
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      reviewsService.getDriverReviews.mockRejectedValueOnce(
        new BadRequestException('Invalid pagination'),
      );

      await expect(controller.getMyReviews(user, query)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
