import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { ComfortLevel } from '../../../generated/prisma/client';

export class ProcessApplicationDto {
  @IsEnum(['approve', 'reject'])
  action!: 'approve' | 'reject';

  @ValidateIf((o: ProcessApplicationDto) => o.action === 'reject')
  @IsString()
  comment?: string;

  // Поля, обязательные только при approve
  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  driverLicenseNumber?: string;

  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carMake?: string;

  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carModel?: string;

  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carColor?: string;

  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsString()
  carPlate?: string;

  @ValidateIf((o: ProcessApplicationDto) => o.action === 'approve')
  @IsEnum(ComfortLevel)
  comfortLevel?: ComfortLevel;
}
