import { BrowserDataDto } from '../users/session/dto/browser-data.dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  accessTokenOptions,
  refreshTokenOptions,
} from '../../config/jwtOptions';
import { ERROR_CREATING_SESSION } from '../../config/constants';
import { Token } from '../../interfaces/Token.interface';
import { Tokens } from '../../interfaces/Tokens.interface';
import { SessionService } from '../../modules/users/session/session.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}
  private readonly logger = new Logger(TokenService.name);
  private generateAccessToken(user: User): Token {
    const payload = {
      id: user.id,
      email: user.email,
      type: 'access_token',
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User): Token {
    const payload = {
      id: user.id,
      email: user.email,
      type: 'refresh_token',
    };
    return this.jwtService.sign(payload, {
      secret: refreshTokenOptions.secret,
      expiresIn: refreshTokenOptions.expiresIn,
    });
  }

  public async createTokensAndSession(
    user: User,
    browserDataDto: BrowserDataDto,
  ): Promise<Tokens> {
    const accessToken: Token = this.generateAccessToken(user);
    const refreshToken: Token = this.generateRefreshToken(user);
    const expiresAt = this.getNewExpiresAtForAccessToken();
    const tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    try {
      this.sessionService.upsertSessionByFingerPrint(user.id, {
        ...browserDataDto,
        refreshToken,
        expiresAt,
      });
      return tokens;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ERROR_CREATING_SESSION);
    }
  }
  public getNewExpiresAtForAccessToken(): Date {
    return new Date(Date.now() + accessTokenOptions.expiresIn * 1000);
  }

  public getNewExpiresAtForRefreshToken(): Date {
    return new Date(Date.now() + refreshTokenOptions.expiresIn * 1000);
  }
}
