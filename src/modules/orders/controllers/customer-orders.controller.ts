import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { OrdersService } from '../orders.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';

@Controller('customers/orders')
export class CustomerOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('history')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer')
  getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.ordersService.getCustomerHistory(user.sub, query);
  }
}
