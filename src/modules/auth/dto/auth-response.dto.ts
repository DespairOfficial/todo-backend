import { JWT_TOKEN_EXAMPLE } from '../../../config/constants';
import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from '../../../modules/users/dto/user-info.dto';
export class AuthResponseDto {
  @ApiProperty({
    type: UserInfoDto,
  })
  user: UserInfoDto;
  @ApiProperty({
    example: JWT_TOKEN_EXAMPLE,
  })
  accessToken: string;
}
