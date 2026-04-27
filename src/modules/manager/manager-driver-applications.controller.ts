import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  UseGuards,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DriverApplicationService } from '../../modules/drivers/driver-application.service';
import { ProcessApplicationDto } from './dtos/process-application.dto';
import { ApplicationStatus } from '../../generated/prisma/browser';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.interface';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('driver-applications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('manager')
export class ManagerDriverApplicationsController {
  constructor(private readonly appService: DriverApplicationService) {}

  @Get()
  findAll(
    @Query('status', new ParseEnumPipe(ApplicationStatus, { optional: true }))
    status?: ApplicationStatus,
  ) {
    return this.appService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appService.findById(id);
  }

  @Patch(':id')
  process(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const managerId = user.sub;
    return this.appService.processApplication(id, dto, managerId);
  }
}
