// src/modules/reviews/controllers/customer-reviews.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { ReviewsService } from '../reviews.service';
import { CreateReviewDto } from '../dtos/create-review.dto';

@Controller('orders')
export class CustomerReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':id/review')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer')
  createReview(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewsService.create(orderId, user.sub, dto);
  }

  @Get(':id/review')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer', 'driver', 'manager')
  getReview(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewsService.getByOrderId(orderId, user);
  }
}
