import { Controller, Post, Body } from '@nestjs/common';
import { DriverApplicationService } from '../driver-application.service';
import { CreateDriverApplicationDto } from '../dtos/create-driver-application.dto';

@Controller('driver-applications')
export class DriversApplicationController {
  constructor(private readonly appService: DriverApplicationService) {}

  @Post()
  create(@Body() dto: CreateDriverApplicationDto) {
    return this.appService.createApplication(dto);
  }
}
