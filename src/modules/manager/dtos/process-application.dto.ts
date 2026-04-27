import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { ComfortLevel } from '../../../generated/prisma/client';

export class ProcessApplicationDto {
  @ApiProperty({
    description: 'Действие менеджера',
    enum: ['approve', 'reject'],
    example: 'approve',
  })
  @IsEnum(['approve', 'reject'])
  action!: 'approve' | 'reject';

  @ApiProperty({
    description: 'Комментарий при отказе',
    example: 'Недостаточно данных',
    required: false,
  })
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'reject')
  @IsString()
  comment?: string;

  // Поля, обязательные только при approve
  @ApiProperty({
    description: 'Номер водительского удостоверения',
    example: 'AB1234567',
    required: false,
  })
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  driverLicenseNumber?: string;

  @ApiProperty({
    description: 'Марка авто',
    example: 'Toyota',
    required: false,
  })
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carMake?: string;

  @ApiProperty({
    description: 'Модель авто',
    example: 'Camry',
    required: false,
  })
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carModel?: string;

  @ApiProperty({ description: 'Цвет авто', example: 'Белый', required: false })
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carColor?: string;

  @ApiProperty({
    description: 'Номер авто',
    example: '1234 AB-7',
    required: false,
  })
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carPlate?: string;

  @ApiProperty({
    description: 'Класс комфорта',
    enum: ComfortLevel,
    example: ComfortLevel.comfort,
    required: false,
  })
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsEnum(ComfortLevel)
  comfortLevel?: ComfortLevel;
}
