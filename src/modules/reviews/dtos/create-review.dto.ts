import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Оценка 1-5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({
    description: 'Комментарий',
    example: 'Вежливый водитель',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
