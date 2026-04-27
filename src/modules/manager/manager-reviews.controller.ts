import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ReviewsService } from '../reviews/reviews.service';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';

@Controller('reviews')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('manager')
export class ManagerReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.reviewsService.findAll(query);
  }
}
