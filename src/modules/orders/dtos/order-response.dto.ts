import { ApiProperty } from '@nestjs/swagger';
import { ComfortLevel, OrderStatus } from '../../../generated/prisma/client';

export class OrderResponseDto {
  @ApiProperty({ description: 'ID заказа', example: 101 })
  id!: number;

  @ApiProperty({ description: 'ID клиента', example: 12 })
  customerId!: number;

  @ApiProperty({
    description: 'ID профиля водителя',
    example: 7,
    required: false,
  })
  driverId!: number | null;

  @ApiProperty({ description: 'Адрес подачи', example: 'Минск, ул. Ленина 1' })
  pickupAddress!: string;

  @ApiProperty({
    description: 'Широта точки подачи',
    example: 53.902334,
    required: false,
  })
  pickupLatitude!: number | null;

  @ApiProperty({
    description: 'Долгота точки подачи',
    example: 27.561879,
    required: false,
  })
  pickupLongitude!: number | null;

  @ApiProperty({
    description: 'Адрес назначения',
    example: 'Минск, пр. Победителей 7',
  })
  dropoffAddress!: string;

  @ApiProperty({
    description: 'Широта точки назначения',
    example: 53.910123,
    required: false,
  })
  dropoffLatitude!: number | null;

  @ApiProperty({
    description: 'Долгота точки назначения',
    example: 27.534567,
    required: false,
  })
  dropoffLongitude!: number | null;

  @ApiProperty({
    description: 'Класс комфорта',
    enum: ComfortLevel,
    example: ComfortLevel.economy,
  })
  comfortLevel!: ComfortLevel;

  @ApiProperty({ description: 'Дистанция, м', example: 5400, required: false })
  distanceMeters!: number | null;

  @ApiProperty({
    description: 'Длительность, сек',
    example: 780,
    required: false,
  })
  durationSec!: number | null;

  @ApiProperty({ description: 'Цена, BYN', example: 8.5, required: false })
  priceByn!: number | null;

  @ApiProperty({
    description: 'Статус заказа',
    enum: OrderStatus,
    example: OrderStatus.searchingDriver,
  })
  status!: OrderStatus;

  @ApiProperty({
    description: 'Дата создания',
    example: '2026-04-27T10:15:00.000Z',
    required: false,
  })
  createdAt!: Date | null;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2026-04-27T10:16:00.000Z',
    required: false,
  })
  updatedAt!: Date | null;

  @ApiProperty({
    description: 'Время принятия',
    example: '2026-04-27T10:20:00.000Z',
    required: false,
  })
  acceptedAt!: Date | null;

  @ApiProperty({
    description: 'Время завершения',
    example: '2026-04-27T10:45:00.000Z',
    required: false,
  })
  finishedAt!: Date | null;
}
