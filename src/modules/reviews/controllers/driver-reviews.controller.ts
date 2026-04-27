import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { ReviewsService } from '../reviews.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';

@Controller('drivers')
export class DriverReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('me/reviews')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  getMyReviews(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.getDriverReviews(user.sub, query);
  }
}
