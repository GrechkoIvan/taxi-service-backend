import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateDriverStatusDto {
  @ApiProperty({ description: 'Онлайн статус', example: true })
  @IsBoolean()
  isOnline!: boolean;
}
