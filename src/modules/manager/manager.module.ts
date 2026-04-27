import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ManagerDriverApplicationsController } from './manager-driver-applications.controller';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [
    DriversModule,
    RouterModule.register([
      {
        path: 'manager',
        module: ManagerModule,
      },
    ]),
  ],
  controllers: [ManagerDriverApplicationsController],
})
export class ManagerModule {}
