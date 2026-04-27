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
import { OrdersService } from '../orders.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedDto } from '../../../common/dtos/paginated.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';

@ApiTags('Заказы')
@ApiBearerAuth()
@Controller('drivers/orders')
export class DriverOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('available')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  @ApiOperation({ summary: 'Доступные заказы для водителя' })
  @ApiResponse({
    status: 200,
    description: 'Список доступных заказов',
    type: [OrderResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  getAvailable(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findAvailable(user.sub);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  @ApiExtraModels(PaginatedDto, OrderResponseDto)
  @ApiOperation({ summary: 'История заказов водителя' })
  @ApiResponse({
    status: 200,
    description: 'История заказов',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(OrderResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.ordersService.getDriverHistory(user.sub, query);
  }
}
