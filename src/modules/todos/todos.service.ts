import { PrismaService } from './../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userId: User['id'], createTodoDto: CreateTodoDto) {
    return await this.prismaService.task.create({
      data: { ...createTodoDto, userId },
    });
  }

  async findAll() {
    return await this.prismaService.task.findMany();
  }

  async findByUser(userId: User['id']) {
    return await this.prismaService.task.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.task.findFirstOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    return await this.prismaService.task.update({
      where: { id },
      data: { ...updateTodoDto },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
