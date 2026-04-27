import { ApiProperty } from '@nestjs/swagger';
import {
  ApplicationStatus,
  ComfortLevel,
} from '../../../generated/prisma/client';

export class DriverApplicationResponseDto {
  @ApiProperty({ description: 'ID заявки', example: 10 })
  id!: number;

  @ApiProperty({ description: 'Email заявителя', example: 'driver@test.by' })
  email!: string;

  @ApiProperty({ description: 'Имя заявителя', example: 'Иван' })
  name!: string;

  @ApiProperty({ description: 'Телефон заявителя', example: '+375291234567' })
  phone!: string;

  @ApiProperty({ description: 'Хэш пароля', example: '$2b$10$hash' })
  passwordHash!: string;

  @ApiProperty({
    description: 'Номер водительского удостоверения',
    example: 'AB1234567',
    required: false,
  })
  driverLicense!: string | null;

  @ApiProperty({
    description: 'Марка авто',
    example: 'Toyota',
    required: false,
  })
  carMake!: string | null;

  @ApiProperty({
    description: 'Модель авто',
    example: 'Camry',
    required: false,
  })
  carModel!: string | null;

  @ApiProperty({ description: 'Цвет авто', example: 'Белый', required: false })
  carColor!: string | null;

  @ApiProperty({
    description: 'Номер авто',
    example: '1234 AB-7',
    required: false,
  })
  carNumber!: string | null;

  @ApiProperty({
    description: 'Класс комфорта',
    enum: ComfortLevel,
    example: ComfortLevel.comfort,
    required: false,
  })
  comfortLevel!: ComfortLevel | null;

  @ApiProperty({
    description: 'Статус заявки',
    enum: ApplicationStatus,
    example: ApplicationStatus.pending,
  })
  status!: ApplicationStatus;

  @ApiProperty({
    description: 'Комментарий менеджера',
    example: 'Не хватает данных',
    required: false,
  })
  comment!: string | null;

  @ApiProperty({ description: 'ID менеджера', example: 5, required: false })
  reviewedBy!: number | null;

  @ApiProperty({
    description: 'Дата рассмотрения',
    example: '2026-04-27T12:00:00.000Z',
    required: false,
  })
  reviewedAt!: Date | null;

  @ApiProperty({
    description: 'ID профиля водителя',
    example: 7,
    required: false,
  })
  driverId!: number | null;

  @ApiProperty({
    description: 'Дата подачи',
    example: '2026-04-27T09:00:00.000Z',
    required: false,
  })
  createdAt!: Date | null;
}
