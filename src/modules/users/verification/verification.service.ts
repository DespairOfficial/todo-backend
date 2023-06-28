import { PrismaService } from '../../database/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class VerificationService {
  constructor(private prismaService: PrismaService) {}

  async setForgotPasswordToken(email: string, forgotPasswordCode: string) {
    await this.prismaService.verification.upsert({
      where: {
        email,
      },
      update: { forgotPasswordCode },
      create: { email, forgotPasswordCode },
    });
    return forgotPasswordCode;
  }

  async verifyPasswordForgotCode(email: string, forgotPasswordCode: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });

    const forgotPasswordCodeInDB =
      await this.prismaService.verification.findFirstOrThrow({
        where: {
          email,
        },
      });
    if (!forgotPasswordCodeInDB.forgotPasswordCode) {
      throw new BadRequestException('You did not ask for restoration yet');
    }
    if (forgotPasswordCodeInDB.forgotPasswordCode === forgotPasswordCode) {
      await this.prismaService.verification.update({
        where: {
          email,
        },
        data: {
          forgotPasswordCode: null,
        },
      });
      return user;
    }
    throw new BadRequestException('Wrong verification code');
  }

  async setEmailVerificationCode(email: string, emailVerificationCode: string) {
    await this.prismaService.verification.upsert({
      where: {
        email,
      },
      update: { emailVerificationCode },
      create: { email, emailVerificationCode },
    });
    return emailVerificationCode;
  }

  async verifyEmailVerificationCode(
    email: string,
    emailVerificationCode: string,
  ) {
    const verificationRow =
      await this.prismaService.verification.findFirstOrThrow({
        where: {
          email,
        },
      });
    if (!verificationRow.emailVerificationCode) {
      throw new BadRequestException('No register request sent yet');
    }
    if (verificationRow.emailVerificationCode === emailVerificationCode) {
      await this.prismaService.verification.update({
        where: {
          email,
        },
        data: {
          forgotPasswordCode: null,
        },
      });
			return true
    }
    throw new BadRequestException('Wrong verification code');
  }
}
