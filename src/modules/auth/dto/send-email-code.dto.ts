import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from '@nestjs/class-validator';

export class SendEmailCodeDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user, unique ',
  })
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Must be email' })
  readonly email: string;
}
