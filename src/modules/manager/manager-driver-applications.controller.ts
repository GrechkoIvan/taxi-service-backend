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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DriverApplicationService } from '../../modules/drivers/driver-application.service';
import { ProcessApplicationDto } from './dtos/process-application.dto';
export enum ApplicationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}
import type { AuthenticatedUser } from '../../common/types/authenticated-user.interface';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DriverApplicationResponseDto } from '../drivers/dtos/driver-application-response.dto';

@ApiTags('Менеджер – Заявки')
@ApiBearerAuth()
@Controller('driver-applications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('manager')
export class ManagerDriverApplicationsController {
  constructor(private readonly appService: DriverApplicationService) {}

  @Get()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ApplicationStatus,
    description: 'Фильтр по статусу заявки',
  })
  @ApiOperation({ summary: 'Список заявок' })
  @ApiResponse({
    status: 200,
    description: 'Список заявок',
    type: [DriverApplicationResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  findAll(
    @Query('status', new ParseEnumPipe(ApplicationStatus, { optional: true }))
    status?: ApplicationStatus,
  ) {
    return this.appService.findAll(status);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Детали заявки' })
  @ApiResponse({
    status: 200,
    description: 'Детали заявки',
    type: DriverApplicationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appService.findById(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Обработать заявку' })
  @ApiResponse({
    status: 200,
    description: 'Заявка обработана',
    type: DriverApplicationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  process(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const managerId = user.sub;
    return this.appService.processApplication(id, dto, managerId);
  }
}
