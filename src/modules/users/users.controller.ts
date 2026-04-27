import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.interface';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserProfileDto } from './dtos/user-profile.dto';

@ApiTags('Пользователи')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer', 'driver', 'manager')
  @Get('me')
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.sub);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer', 'driver', 'manager')
  @Patch('me')
  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль обновлён',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, dto);
  }
}
