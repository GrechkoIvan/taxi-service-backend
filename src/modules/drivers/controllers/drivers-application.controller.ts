import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DriverApplicationService } from '../driver-application.service';
import { CreateDriverApplicationDto } from '../dtos/create-driver-application.dto';
import { DriverApplicationResponseDto } from '../dtos/driver-application-response.dto';

@ApiTags('Водители – Заявки')
@Controller('driver-applications')
export class DriversApplicationController {
  constructor(private readonly appService: DriverApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Подача заявки на водителя' })
  @ApiResponse({
    status: 201,
    description: 'Заявка создана',
    type: DriverApplicationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 409, description: 'Email уже используется' })
  create(@Body() dto: CreateDriverApplicationDto) {
    return this.appService.createApplication(dto);
  }
}
