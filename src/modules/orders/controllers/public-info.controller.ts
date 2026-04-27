import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { OrdersService } from '../orders.service';

@Controller()
export class PublicInfoController {
  constructor(private ordersService: OrdersService) {}

  @Get('drivers/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer')
  getDriverInfo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.getDriverPublicInfo(id, user.sub);
  }

  @Get('customers/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  getCustomerInfo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.getCustomerPublicInfo(id, user.sub);
  }
}
