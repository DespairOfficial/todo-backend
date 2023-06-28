import { MailService } from './../../mail/mail.service';
import { PasswordService } from './password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { createHmac } from 'crypto';
import { Controller, Req, Patch, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateCustomHeadersDto } from '../session/dto/validate-custom-headers.dto';
import { VerificationService } from '../verification/verification.service';
import { CustomHeaders } from '../../../decorators/headers.decorator';
import * as bcrypt from 'bcryptjs';

@ApiTags('Password')
@Controller('password')
export class PasswordController {
  constructor(
    private verificationService: VerificationService,
    private passwordService: PasswordService,
    private mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Send email if forgot password' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { message: 'Code was sended!' },
    },
  })
  @Post('forgot')
  async forgotPassword(
    @CustomHeaders() headers: ValidateCustomHeadersDto,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const code = createHmac('sha256', process.env.SECRET_FOR_HASH)
      .update(`${new Date()}${headers.fingerprint}${headers.userAgent}`)
      .digest('hex');
    const forgotPasswordCode = await this.verificationService.setForgotPasswordToken(forgotPasswordDto.email, code);
    await this.mailService.sendForgotPassword(forgotPasswordDto.email, forgotPasswordCode);
    return { message: 'Code was sended!' };
  }

  @ApiOperation({ summary: 'Restore password' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { message: 'Password was changed!' },
    },
  })
  @Patch('restore')
  async restorePassword(
    @CustomHeaders() headers: ValidateCustomHeadersDto,
    @Body() restorePasswordDto: RestorePasswordDto,
  ) {
    const { email, password, restorePasswordHash } = restorePasswordDto;
    const user = await this.verificationService.verifyPasswordForgotCode(email, restorePasswordHash);
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      this.passwordService.updatePassword(user.id, hashedPassword);
      return { message: 'Password was changed!' };
    }
  }
}
