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
  @IsString()
  pickupAddress!: string;

  @IsOptional()
  @IsNumber()
  @IsLatitude()
  pickupLatitude?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  pickupLongitude?: number;

  @IsString()
  dropoffAddress!: string;

  @IsOptional()
  @IsNumber()
  @IsLatitude()
  dropoffLatitude?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  dropoffLongitude?: number;

  @IsEnum(ComfortLevel)
  comfortLevel!: ComfortLevel;
}
