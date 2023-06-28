import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PasswordEntity } from '../password/entities/password.enitity';

export class UserEntity implements User {
  @ApiProperty({
    example: '1',
    description: 'Id of user',
  })
  id: number;

  @ApiProperty({
    example: 'users/asdfasdasfg-img1.png',
    description: 'Path to image',
  })
  image: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    type: PasswordEntity,
  })
  password?: PasswordEntity;
}
