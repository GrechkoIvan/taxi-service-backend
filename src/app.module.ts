import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ManagerModule } from './modules/manager/manager.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './modules/logger/logger.module';
import { RabbitMQModule } from './modules/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    RabbitMQModule,
    AuthModule,
    DriversModule,
    UsersModule,
    ManagerModule,
    OrdersModule,
    ReviewsModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
