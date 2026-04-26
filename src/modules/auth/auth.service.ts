import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { RegisterCustomerDto } from './dtos/register-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerCustomer(dto: RegisterCustomerDto) {
    const existing = await this.prisma.userCredential.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      Number(process.env.BCRYPT_ROUNDS) || 10,
    );
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        role: 'customer',
        credentials: {
          create: {
            email: dto.email,
            password: hashedPassword,
          },
        },
      },
      include: { credentials: { select: { email: true } } },
    });

    return this.generateToken(user.id, user.credentials!.email, user.role);
  }

  async login(dto: LoginDto) {
    const credential = await this.prisma.userCredential.findUnique({
      where: { email: dto.email },
      include: { user: true },
    });
    if (!credential) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, credential.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (credential.user.role !== dto.role) {
      throw new UnauthorizedException('Role mismatch');
    }

    return this.generateToken(credential.user.id, credential.email, dto.role);
  }

  async getUserFromToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        driverProfile: true,
        credentials: { select: { email: true } },
      },
    });
    return user;
  }

  private generateToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
