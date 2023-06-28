import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserInfoDto implements Partial<User> {
  @ApiProperty({
    example: '1',
    description: 'Id of user',
  })
  id: number;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    example: 'users/o8u34gfoisydfasdf-me.jpg',
    description: 'image of profile',
  })
  image: string;
}
