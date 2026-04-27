import { ApiProperty } from '@nestjs/swagger';

export class DriverReviewOrderInfoDto {
  @ApiProperty({ description: 'ID заказа', example: 101 })
  id!: number;

  @ApiProperty({ description: 'Адрес подачи', example: 'Минск, ул. Ленина 1' })
  pickupAddress!: string;

  @ApiProperty({
    description: 'Адрес назначения',
    example: 'Минск, пр. Победителей 7',
  })
  dropoffAddress!: string;

  @ApiProperty({
    description: 'Дата создания заказа',
    example: '2026-04-27T09:30:00.000Z',
    required: false,
  })
  createdAt!: Date | null;
}

export class DriverReviewItemDto {
  @ApiProperty({ description: 'ID отзыва', example: 55 })
  id!: number;

  @ApiProperty({ description: 'ID заказа', example: 101 })
  orderId!: number;

  @ApiProperty({ description: 'Оценка', example: 5 })
  rating!: number;

  @ApiProperty({
    description: 'Комментарий',
    example: 'Вежливый водитель',
    required: false,
  })
  comment!: string | null;

  @ApiProperty({
    description: 'Дата создания',
    example: '2026-04-27T11:00:00.000Z',
    required: false,
  })
  createdAt!: Date | null;

  @ApiProperty({
    description: 'Информация о заказе',
    type: DriverReviewOrderInfoDto,
  })
  order!: DriverReviewOrderInfoDto;
}
