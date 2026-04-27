import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthenticatedUser } from '../../common/types/authenticated-user.interface';
import { CreateReviewDto } from './dtos/create-review.dto';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import {
  getPaginationOptions,
  paginate,
  PaginateResult,
} from '../../common/utils/pagination.utils';
import { Prisma, Review } from '../../generated/prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    orderId: number,
    customerId: number,
    dto: CreateReviewDto,
  ): Promise<Review> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== customerId)
      throw new ForbiddenException('You can review only your own orders');
    if (order.status !== 'finished')
      throw new BadRequestException('Order is not finished yet');

    const existing = await this.prisma.review.findUnique({
      where: { orderId },
    });
    if (existing) throw new BadRequestException('Review already exists');

    return this.prisma.review.create({
      data: {
        orderId,
        rating: dto.rating,
        comment: dto.comment ?? null,
      },
    });
  }

  async getByOrderId(
    orderId: number,
    user: AuthenticatedUser,
  ): Promise<Review | null> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'customer' && order.customerId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }

    if (user.role === 'driver') {
      const driver = await this.prisma.driverProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!driver || order.driverId !== driver.id) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.prisma.review.findUnique({
      where: { orderId },
    });
  }

  async getDriverReviews(
    driverUserId: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginateResult<Review> & { averageRating: number | null }> {
    const driver = await this.prisma.driverProfile.findUnique({
      where: { userId: driverUserId },
    });

    if (!driver) {
      return {
        data: [],
        meta: { total: 0, offset: 0, limit: 10, hasMore: false },
        averageRating: null,
      };
    }

    const { offset, limit } = getPaginationOptions(paginationQuery);
    const where: Prisma.ReviewWhereInput = {
      order: { driverId: driver.id },
    };

    const [data, total, aggregation] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              pickupAddress: true,
              dropoffAddress: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
      this.prisma.review.aggregate({
        _avg: { rating: true },
        where,
      }),
    ]);

    return {
      ...paginate(data, total, { offset, limit }),
      averageRating: aggregation._avg.rating ?? null,
    };
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginateResult<Review>> {
    const { offset, limit } = getPaginationOptions(paginationQuery);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        skip: offset,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              customer: { select: { id: true, name: true } },
              driver: {
                select: { id: true, user: { select: { name: true } } },
              },
              pickupAddress: true,
              dropoffAddress: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.review.count(),
    ]);

    return paginate(data, total, { offset, limit });
  }
}
