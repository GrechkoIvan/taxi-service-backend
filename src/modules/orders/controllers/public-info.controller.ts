import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { OrdersService } from '../orders.service';
import {
  CustomerPublicInfoDto,
  DriverPublicInfoDto,
} from '../dtos/public-info.dto';

@ApiTags('Публичная информация')
@ApiBearerAuth()
@Controller()
export class PublicInfoController {
  constructor(private ordersService: OrdersService) {}

  @Get('drivers/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Публичная информация о водителе' })
  @ApiResponse({
    status: 200,
    description: 'Информация о водителе',
    type: DriverPublicInfoDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  getDriverInfo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.getDriverPublicInfo(id, user.sub);
  }

  @Get('customers/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Публичная информация о клиенте' })
  @ApiResponse({
    status: 200,
    description: 'Информация о клиенте',
    type: CustomerPublicInfoDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  getCustomerInfo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.getCustomerPublicInfo(id, user.sub);
  }
}
