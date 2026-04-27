import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer')
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.create(dto, user.sub);
  }

  @Get('current')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer', 'driver')
  getCurrent(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.getCurrent(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer', 'driver', 'manager')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.findById(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer', 'driver')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.updateStatus(id, dto, user);
  }
}
