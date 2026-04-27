import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ManagerDriverApplicationsController } from './manager-driver-applications.controller';
import { DriversModule } from '../drivers/drivers.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { ManagerReviewsController } from './manager-reviews.controller';

@Module({
  imports: [
    DriversModule,
    ReviewsModule,
    RouterModule.register([
      {
        path: 'manager',
        module: ManagerModule,
      },
    ]),
  ],
  controllers: [ManagerDriverApplicationsController, ManagerReviewsController],
})
export class ManagerModule {}
