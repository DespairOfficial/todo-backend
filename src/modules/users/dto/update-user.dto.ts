import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email of user',
  })
  @IsEmail()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'Image from Form-Data',
    description: 'Image of a user',
    required: false,
  })
  @IsOptional()
  image: Express.Multer.File;
}
