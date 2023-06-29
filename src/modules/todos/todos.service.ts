import { PaginateTodosDto } from './dto/paginate-todos.dto';
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

  async paginate(userId: User['id'], paginateTodosDto: PaginateTodosDto) {
    const key = paginateTodosDto.orderBy;
    const direction = paginateTodosDto.direction;
    // need a typings here
    const orderObject = {};
    const whereObject = {};
    orderObject[key] = direction;
    whereObject['userId'] = userId;

    const count = await this.prismaService.task.count({
      where: whereObject,
    });

    const body = await this.prismaService.task.findMany({
      skip: +paginateTodosDto.limit * (paginateTodosDto.page - 1),
      take: +paginateTodosDto.limit,
      orderBy: orderObject,
      where: whereObject,
    });

    const last =
      Math.ceil(count / paginateTodosDto.limit) === 0
        ? 1
        : Math.ceil(count / paginateTodosDto.limit);

    return {
      meta: {
        total: count,
        first: 1,
        previous:
          paginateTodosDto.page !== 1 ? paginateTodosDto.page - 1 : null,
        current: paginateTodosDto.page,
        next: paginateTodosDto.page !== last ? paginateTodosDto.page + 1 : null,
        last,
        limit: paginateTodosDto.limit,
      },
      body,
    };
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

  async remove(id: number) {
    return await this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }
}
