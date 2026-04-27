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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { ReviewsService } from '../reviews.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { ReviewResponseDto } from '../dtos/review-response.dto';

@ApiTags('Отзывы')
@ApiBearerAuth()
@Controller('orders')
export class CustomerReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':id/review')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Оставить отзыв по заказу' })
  @ApiResponse({
    status: 201,
    description: 'Отзыв создан',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
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
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Получить отзыв по заказу' })
  @ApiResponse({
    status: 200,
    description: 'Отзыв по заказу',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  getReview(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewsService.getByOrderId(orderId, user);
  }
}
