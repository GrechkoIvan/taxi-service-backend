import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ComfortLevel } from '../../../generated/prisma/client';

export class CreateOrderDto {
  @ApiProperty({ description: 'Адрес подачи', example: 'Минск, ул. Ленина 1' })
  @IsString()
  pickupAddress!: string;

  @ApiProperty({
    description: 'Широта точки подачи',
    example: 53.902334,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  pickupLatitude?: number;

  @ApiProperty({
    description: 'Долгота точки подачи',
    example: 27.561879,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  pickupLongitude?: number;

  @ApiProperty({
    description: 'Адрес назначения',
    example: 'Минск, пр. Победителей 7',
  })
  @IsString()
  dropoffAddress!: string;

  @ApiProperty({
    description: 'Широта точки назначения',
    example: 53.910123,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  dropoffLatitude?: number;

  @ApiProperty({
    description: 'Долгота точки назначения',
    example: 27.534567,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  dropoffLongitude?: number;

  @ApiProperty({
    description: 'Класс комфорта',
    enum: ComfortLevel,
    example: ComfortLevel.economy,
  })
  @IsEnum(ComfortLevel)
  comfortLevel!: ComfortLevel;
}
