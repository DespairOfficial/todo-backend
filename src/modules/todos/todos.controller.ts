import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { TodoEntity } from './entities/todo.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({ summary: 'Create todo task' })
  @ApiCreatedResponse({
    type: TodoEntity,
  })
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Req() requst: Request) {
    return await this.todosService.create(requst.user.id, createTodoDto);
  }

  @ApiOperation({ summary: 'Get all tasks for current user' })
  @ApiCreatedResponse({
    type: [TodoEntity],
  })
  @Get()
  findForCurrentUser(@Req() requst: Request) {
    return this.todosService.findByUser(requst.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() requst: Request,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const task = await this.todosService.findOne(id);
    if (task.userId !== requst.user.id) {
      throw new ForbiddenException('You cannot perform this aciton!');
    }
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }
}
