import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateDriverApplicationDto } from './dtos/create-driver-application.dto';
import { ProcessApplicationDto } from '../manager/dtos/process-application.dto';
import * as bcrypt from 'bcrypt';
import {
  ApplicationStatus,
  DriverApplication,
  Prisma,
} from '../../generated/prisma/client';

@Injectable()
export class DriverApplicationService {
  constructor(private prisma: PrismaService) {}

  // 1. Подача заявки (публичный)
  async createApplication(dto: CreateDriverApplicationDto) {
    const existing = await this.prisma.userCredential.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.driverApplication.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        status: 'pending',
      },
    });
  }

  // 2. Список заявок (менеджер)
  async findAll(status?: ApplicationStatus) {
    const where: Prisma.DriverApplicationWhereInput = status ? { status } : {};
    return this.prisma.driverApplication.findMany({ where });
  }

  // 3. Детали заявки
  async findById(id: number): Promise<DriverApplication> {
    const app = await this.prisma.driverApplication.findUnique({
      where: { id },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  // 4. Обработка заявки (одобрить/отклонить)
  async processApplication(
    id: number,
    dto: ProcessApplicationDto,
    managerId: number,
  ) {
    const application = await this.findById(id);
    if (application.status !== 'pending') {
      throw new BadRequestException('Application already processed');
    }

    if (dto.action === 'reject') {
      return this.prisma.driverApplication.update({
        where: { id },
        data: {
          status: 'rejected',
          comment: dto.comment,
          reviewedBy: managerId,
          reviewedAt: new Date(),
        },
      });
    }

    // approve: проверяем, что обязательные поля переданы (можно пропустить, т.к. DTO уже отвалидировал)
    if (
      !dto.driverLicenseNumber ||
      !dto.carMake ||
      !dto.carModel ||
      !dto.carPlate ||
      !dto.comfortLevel
    ) {
      throw new BadRequestException('Missing required fields for approval');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Заполняем в заявке поля, полученные от менеджера (для истории)
      await tx.driverApplication.update({
        where: { id },
        data: {
          driverLicense: dto.driverLicenseNumber,
          carMake: dto.carMake,
          carModel: dto.carModel,
          carColor: dto.carColor,
          carNumber: dto.carPlate,
          comfortLevel: dto.comfortLevel,
        },
      });

      // 2. Создаём пользователя
      const user = await tx.user.create({
        data: {
          name: application.name,
          phone: application.phone,
          role: 'driver',
        },
      });

      // 3. Учётные данные (хэш пароля уже в заявке)
      await tx.userCredential.create({
        data: {
          userId: user.id,
          email: application.email,
          password: application.passwordHash,
        },
      });

      // 4. Профиль водителя
      const driverProfile = await tx.driverProfile.create({
        data: {
          userId: user.id,
          comfortLevel: dto.comfortLevel!,
          driverLicense: dto.driverLicenseNumber!,
        },
      });

      // 5. Автомобиль
      if (dto.carMake || dto.carModel || dto.carPlate) {
        await tx.car.create({
          data: {
            driverId: driverProfile.id,
            make: dto.carMake!,
            model: dto.carModel!,
            color: dto.carColor ?? null,
            number: dto.carPlate!,
          },
        });
      }

      // 6. Финальное обновление заявки: статус, связь с профилем
      const updated = await tx.driverApplication.update({
        where: { id },
        data: {
          status: 'approved',
          reviewedBy: managerId,
          reviewedAt: new Date(),
          driverId: driverProfile.id,
        },
      });

      return updated;
    });
  }
}
