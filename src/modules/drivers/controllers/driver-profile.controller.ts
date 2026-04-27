import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.interface';
import { UsersService } from '../../users/users.service';
import { UpdateDriverStatusDto } from '../dtos/update-driver-status.dto';

@Controller('drivers')
export class DriverProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('driver')
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateDriverStatusDto,
  ) {
    return this.usersService.setOnlineStatus(user.sub, dto.isOnline);
  }
}
