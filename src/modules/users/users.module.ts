import { PasswordService } from './password/password.service';
import { VerificationService } from './verification/verification.service';
import { FileModule } from './../file/file.module';
import { SessionService } from './session/session.service';
import { DatabaseModule } from '../database/database.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    SessionService,
    VerificationService,
    PasswordService,
  ],
  exports: [UsersService, SessionService, VerificationService, PasswordService],
  imports: [DatabaseModule, forwardRef(() => AuthModule), FileModule],
})
export class UsersModule {}
