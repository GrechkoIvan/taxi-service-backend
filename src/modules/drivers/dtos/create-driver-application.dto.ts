import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateDriverApplicationDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' })
  phone!: string;
}
