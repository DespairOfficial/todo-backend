import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from '@nestjs/class-validator';
import { User } from '@prisma/client';

export class CreateUserDto implements Partial<User> {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user, unique ',
  })
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Must be email' })
  readonly email: string;
}
