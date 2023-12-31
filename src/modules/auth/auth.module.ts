import { MailModule } from './../mail/mail.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { accessTokenOptions } from '../../config/jwtOptions';
import { TokenService } from './token.service';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: accessTokenOptions.secret,
      signOptions: { expiresIn: accessTokenOptions.expiresIn },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
