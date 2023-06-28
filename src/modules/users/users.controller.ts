import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'update self user info' })
  @ApiOkResponse({
    type: UserInfoDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  async updateUser(
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    return await this.usersService.update(
      request.user.id,
      updateUserDto,
      image,
    );
  }
}
