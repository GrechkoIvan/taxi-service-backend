import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './controllers/orders.controller';
import { DriverOrdersController } from './controllers/driver-orders.controller';
import { CustomerOrdersController } from './controllers/customer-orders.controller';
import { PublicInfoController } from './controllers/public-info.controller';

@Module({
  controllers: [
    OrdersController,
    DriverOrdersController,
    CustomerOrdersController,
    PublicInfoController,
  ],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
