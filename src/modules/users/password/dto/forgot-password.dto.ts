import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'New very strong password',
  })
  @IsEmail()
  readonly email: string;
}
