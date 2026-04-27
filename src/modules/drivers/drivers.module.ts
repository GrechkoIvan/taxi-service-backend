import { Module } from '@nestjs/common';
import { DriversApplicationController } from './controllers/drivers-application.controller';
import { DriverApplicationService } from './driver-application.service';
import { DriverProfileController } from './controllers/driver-profile.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DriversApplicationController, DriverProfileController],
  providers: [DriverApplicationService],
  exports: [DriverApplicationService],
})
export class DriversModule {}
