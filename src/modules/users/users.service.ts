import { FileService } from './../file/file.service';
import { PrismaService } from '../../modules/database/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { Password } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private fileService: FileService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    password: string,
    image: Express.Multer.File,
  ): Promise<User> {
    const filename = await this.fileService.updateMulterFile(image, 'users');

    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        image: filename,
        password: {
          create: { password: password },
        },
      },
    });
    return user;
  }

  async findOne(id: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findOneByUserId(userId: number): Promise<Password> {
    return await this.prismaService.password.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    image: Express.Multer.File,
  ): Promise<User> {
    const userBeforeUpdate = await this.prismaService.user.findFirstOrThrow({
      where: { id },
    });

    const imgOrString = image ?? updateUserDto.image;

    const filename = await this.fileService.updateMulterFile(
      imgOrString,
      'users',
      userBeforeUpdate.image,
    );

    return await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: { ...updateUserDto, image: filename },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany({});
  }

  async delete(id: number): Promise<User> {
    const deletedUser = await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
    if (deletedUser.image && deletedUser.image != '') {
      await this.fileService.deleteFile(deletedUser.image);
    }
    return deletedUser;
  }
}
