import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from '@nestjs/class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user, unique ',
  })
  @IsString()
  @IsEmail({}, { message: 'Must be email' })
  email: string;

  @ApiProperty({
    example: '7asg9dfyvs9f81obuf0',
    description: 'Code from mail',
  })
  @IsString()
  emailVerificationCode: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'Image from Form-Data',
    description: 'Image of a news',
    required: false,
  })
  @IsOptional()
  image: string;

  @ApiProperty({
    example: 'asdf_1s!@41$#afafg9',
    description: 'Password. Stored in hased form',
  })
  @IsString()
  @Length(6, 50)
  readonly password: string;
}
