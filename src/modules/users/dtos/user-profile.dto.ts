import { ApiProperty } from '@nestjs/swagger';
import { ComfortLevel, UserRole } from '../../../generated/prisma/client';

export class UserCredentialDto {
  @ApiProperty({ description: 'Email', example: 'user@test.by' })
  email!: string;
}

export class CarDto {
  @ApiProperty({ description: 'ID автомобиля', example: 3 })
  id!: number;

  @ApiProperty({ description: 'ID профиля водителя', example: 7 })
  driverId!: number;

  @ApiProperty({ description: 'Марка', example: 'Toyota' })
  make!: string;

  @ApiProperty({ description: 'Модель', example: 'Camry' })
  model!: string;

  @ApiProperty({ description: 'Цвет', example: 'Белый', required: false })
  color!: string | null;

  @ApiProperty({ description: 'Номер', example: '1234 AB-7' })
  number!: string;
}

export class DriverProfileDto {
  @ApiProperty({ description: 'ID профиля', example: 7 })
  id!: number;

  @ApiProperty({ description: 'ID пользователя', example: 12 })
  userId!: number;

  @ApiProperty({
    description: 'Класс комфорта',
    enum: ComfortLevel,
    example: ComfortLevel.comfort,
    required: false,
  })
  comfortLevel!: ComfortLevel | null;

  @ApiProperty({
    description: 'Водительское удостоверение',
    example: 'AB1234567',
  })
  driverLicense!: string;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2026-04-27T10:00:00.000Z',
    required: false,
  })
  updatedAt!: Date | null;

  @ApiProperty({ description: 'Онлайн статус', example: true })
  isOnline!: boolean;

  @ApiProperty({
    description: 'Автомобили',
    isArray: true,
    type: CarDto,
    required: false,
  })
  cars!: CarDto[] | null;
}

export class UserProfileDto {
  @ApiProperty({ description: 'ID пользователя', example: 12 })
  id!: number;

  @ApiProperty({ description: 'Имя', example: 'Иван' })
  name!: string;

  @ApiProperty({ description: 'Телефон', example: '+375291234567' })
  phone!: string;

  @ApiProperty({
    description: 'Роль',
    enum: UserRole,
    example: UserRole.customer,
  })
  role!: UserRole;

  @ApiProperty({
    description: 'Дата создания',
    example: '2026-04-27T08:30:00.000Z',
    required: false,
  })
  createdAt!: Date | null;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2026-04-27T09:00:00.000Z',
    required: false,
  })
  updatedAt!: Date | null;

  @ApiProperty({
    description: 'Профиль водителя',
    type: DriverProfileDto,
    required: false,
  })
  driverProfile!: DriverProfileDto | null;

  @ApiProperty({
    description: 'Учётные данные',
    type: UserCredentialDto,
    required: false,
  })
  credentials!: UserCredentialDto | null;
}
