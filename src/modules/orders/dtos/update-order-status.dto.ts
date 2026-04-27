import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../generated/prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Новый статус заказа',
    enum: OrderStatus,
    example: OrderStatus.driverAssigned,
  })
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
