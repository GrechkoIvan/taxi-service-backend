import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../generated/prisma/client';

export class LoginDto {
  @ApiProperty({ description: 'Email', example: 'user@test.by' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Пароль', example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: UserRole,
    example: UserRole.customer,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
