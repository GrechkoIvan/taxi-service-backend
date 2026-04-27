import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { ReviewsService } from '../reviews.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedDto } from '../../../common/dtos/paginated.dto';
import { DriverReviewItemDto } from '../dtos/driver-review-item.dto';

@ApiTags('Отзывы')
@ApiBearerAuth()
@Controller('drivers')
export class DriverReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('me/reviews')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  @ApiExtraModels(PaginatedDto, DriverReviewItemDto)
  @ApiOperation({ summary: 'Отзывы о водителе' })
  @ApiResponse({
    status: 200,
    description: 'Список отзывов с рейтингом',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(DriverReviewItemDto) },
            },
            averageRating: {
              type: 'number',
              nullable: true,
              example: 4.7,
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  getMyReviews(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.getDriverReviews(user.sub, query);
  }
}
