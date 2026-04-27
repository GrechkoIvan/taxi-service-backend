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
@Controller('customers/orders')
export class CustomerOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('history')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer')
  @ApiExtraModels(PaginatedDto, OrderResponseDto)
  @ApiOperation({ summary: 'История заказов клиента' })
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
    return this.ordersService.getCustomerHistory(user.sub, query);
  }
}
