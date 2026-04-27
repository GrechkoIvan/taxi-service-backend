import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriverApplicationService } from './driver-application.service';

@Module({
  controllers: [DriversController],
  providers: [DriverApplicationService],
  exports: [DriverApplicationService],
})
export class DriversModule {}
