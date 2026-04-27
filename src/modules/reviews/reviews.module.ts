import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CustomerReviewsController } from './controllers/customer-reviews.controller';
import { DriverReviewsController } from './controllers/driver-reviews.controller';

@Module({
  controllers: [CustomerReviewsController, DriverReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
