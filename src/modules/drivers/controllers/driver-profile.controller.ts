import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { UsersService } from '../../users/users.service';
import { UpdateDriverStatusDto } from '../dtos/update-driver-status.dto';
import { DriverProfileDto } from '../../users/dtos/user-profile.dto';

@ApiTags('Водители')
@ApiBearerAuth()
@Controller('drivers')
export class DriverProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  @ApiOperation({ summary: 'Обновить статус водителя' })
  @ApiResponse({
    status: 200,
    description: 'Статус обновлён',
    type: DriverProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateDriverStatusDto,
  ) {
    return this.usersService.setOnlineStatus(user.sub, dto.isOnline);
  }
}
