import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateDriverApplicationDto {
  @ApiProperty({ description: 'Email', example: 'driver@test.by' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Пароль', example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: 'Имя', example: 'Иван' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Телефон', example: '+375291234567' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' })
  phone!: string;
}
