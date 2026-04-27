import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterCustomerDto {
  @ApiProperty({ description: 'Email', example: 'user@test.by' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Пароль', example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: 'Имя', example: 'Иван', minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: 'Телефон', example: '+375291234567' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' })
  phone!: string;
}
