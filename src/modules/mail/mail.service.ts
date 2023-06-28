import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  private logger = new Logger(MailService.name);
  async sendForgotPassword(email: string, token: string) {
    const url = `${process.env.HOST_URL}/password/restore/${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'Despair <ddsmailer@mail.ru>', // override default from
        subject: 'Password restoration',
        template: './forgot-password', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          url,
        },
      });
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  async sendEmailConfirmationCode(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'Despair <ddsmailer@mail.ru>', // override default from
        subject: 'Email confirmation',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          email,
          code,
        },
      });
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }
}
