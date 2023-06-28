import { IsEmail, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestorePasswordDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'New very strong password',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '12341234',
    description: 'New very strong password',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: 'sadg134gasfdg1gsfg',
    description: 'Has from email to restore password',
  })
  @IsString()
  readonly restorePasswordHash: string;
}
