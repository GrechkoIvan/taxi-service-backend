import { ApiProperty } from '@nestjs/swagger';
import { ComfortLevel } from '../../../generated/prisma/client';

export class PublicUserDto {
  @ApiProperty({ description: 'Имя', example: 'Иван' })
  name!: string;

  @ApiProperty({ description: 'Телефон', example: '+375291234567' })
  phone!: string;
}

export class DriverCarDto {
  @ApiProperty({ description: 'Марка', example: 'Toyota' })
  make!: string;

  @ApiProperty({ description: 'Модель', example: 'Camry' })
  model!: string;

  @ApiProperty({ description: 'Цвет', example: 'Белый', required: false })
  color!: string | null;

  @ApiProperty({ description: 'Номер', example: '1234 AB-7' })
  number!: string;
}

export class DriverPublicInfoDto {
  @ApiProperty({ description: 'ID профиля водителя', example: 7 })
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

  @ApiProperty({ description: 'Онлайн статус', example: true })
  isOnline!: boolean;

  @ApiProperty({ description: 'Пользователь', type: PublicUserDto })
  user!: PublicUserDto;

  @ApiProperty({ description: 'Автомобили', isArray: true, type: DriverCarDto })
  cars!: DriverCarDto[];
}

export class CustomerPublicInfoDto {
  @ApiProperty({ description: 'Имя клиента', example: 'Иван' })
  name!: string;

  @ApiProperty({ description: 'Телефон клиента', example: '+375291234567' })
  phone!: string;
}
