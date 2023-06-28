import { MailService } from './../mail/mail.service';
import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { VerificationService } from './../users/verification/verification.service';
import AuthResult from '../../interfaces/AuthResult.interface';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { BrowserDataDto } from '../users/session/dto/browser-data.dto';
import { SessionService } from '../users/session/session.service';
import { TokenService } from './token.service';
import { LogInUserDto } from './dto/log-in-user.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { Token } from '../../interfaces/Token.interface';
import { Tokens } from '../../interfaces/Tokens.interface';
import { User } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { refreshTokenOptions } from '../../config/jwtOptions';
import { createHmac } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private verificationService: VerificationService,
    private mailService: MailService,
  ) {}
  private async validateLogin(userDto: LogInUserDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(userDto.email);
    if (user) {
      const userPassword = await this.usersService.findOneByUserId(user.id);
      const isPasswordValid = await bcrypt.compare(
        userDto.password,
        userPassword.password,
      );
      if (isPasswordValid) {
        return user;
      }
      throw new UnauthorizedException({
        message: 'Wrong password',
      });
    }
    throw new UnauthorizedException({
      message: 'Wrong email',
    });
  }

  private validateRefreshToken(refreshToken: Token): Promise<User> {
    if (!refreshToken) {
      throw new UnauthorizedException('Unvalid refresh token');
    }
    const user = this.jwtService.verify(refreshToken, {
      secret: refreshTokenOptions.secret,
    });
    return user;
  }

  async login(
    logInUserDto: LogInUserDto,
    browserDataDto: BrowserDataDto,
  ): Promise<AuthResult> {
    const user: User = await this.validateLogin(logInUserDto);
    const tokens = await this.tokenService.createTokensAndSession(
      user,
      browserDataDto,
    );
    return { user: user, tokens };
  }

  async register(
    registerUserDto: RegisterUserDto,
    browserDataDto: BrowserDataDto,
    image: Express.Multer.File,
  ): Promise<AuthResult> {
    const candidate: User = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );
    if (candidate) {
      throw new BadRequestException('User with this email already exists');
    }

    const isVerified =
      await this.verificationService.verifyEmailVerificationCode(
        registerUserDto.email,
        registerUserDto.emailVerificationCode,
      );
    if (!isVerified) {
      throw new BadRequestException('Wrong code from email');
    }

    const userDto: CreateUserDto = {
      email: registerUserDto.email,
    };

    const password = registerUserDto.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = await this.usersService.create(
      userDto,
      hashedPassword,
      image,
    );
    const tokens = await this.tokenService.createTokensAndSession(
      user,
      browserDataDto,
    );

    return { user: user, tokens };
  }

  async logout(refreshToken: Token) {
    await this.sessionService.deleteSessionByRefreshToken(refreshToken);
  }

  async refresh(
    refreshToken: Token,
    browserDataDto: BrowserDataDto,
  ): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token in not found');
    }
    const userDataFromToken = await this.validateRefreshToken(refreshToken);
    const sessionDataFromDb = await this.sessionService.findOneByRefreshToken(
      refreshToken,
    );
    if (!userDataFromToken || !sessionDataFromDb) {
      throw new UnauthorizedException('Refresh token not found or malformed');
    }
    const user = await this.usersService.findOne(userDataFromToken.id);
    const tokens = await this.tokenService.createTokensAndSession(
      user,
      browserDataDto,
    );
    return tokens;
  }

  async sendEmailVerificationCode(sendEmailCodeDto: SendEmailCodeDto) {
    const code = createHmac('sha256', process.env.SECRET_FOR_HASH)
      .update(`${new Date()}${sendEmailCodeDto.email}`)
      .digest('hex');
    const genedatedCode =
      await this.verificationService.setEmailVerificationCode(
        sendEmailCodeDto.email,
        code,
      );
    await this.mailService.sendEmailConfirmationCode(
      sendEmailCodeDto.email,
      genedatedCode,
    );
  }
}
