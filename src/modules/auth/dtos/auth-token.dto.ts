import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty({
    description: 'JWT токен доступа',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckB0ZXN0LmJ5Iiwicm9sZSI6ImN1c3RvbWVyIn0.signed',
  })
  access_token!: string;
}
