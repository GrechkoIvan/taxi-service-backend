import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'Сообщение', example: 'Logged out successfully' })
  message!: string;
}
