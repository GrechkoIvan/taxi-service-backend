import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { OrdersService } from '../orders.service';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';

@Controller('drivers/orders')
export class DriverOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('available')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  getAvailable(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findAvailable(user.sub);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.ordersService.getDriverHistory(user.sub, query);
  }
}
