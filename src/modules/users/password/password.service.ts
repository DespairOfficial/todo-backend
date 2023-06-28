import { Injectable } from '@nestjs/common';
import { Password } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PasswordService {
  constructor(private prismaService: PrismaService) {}
  async create(userId: number, password: string): Promise<Password> {
    const passwordObject = await this.prismaService.password.create({
      data: {
        userId: userId,
        password: password,
      },
    });
    return passwordObject;
  }

  async findOneByUserId(userId: number): Promise<Password> {
    return await this.prismaService.password.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async updatePassword(userId: number, newPassword: string) {
    await this.prismaService.password.update({
      where: {
        userId,
      },
      data: {
        password: newPassword,
      },
    });
  }
}
