import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
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
}
