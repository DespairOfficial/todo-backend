import { TodoEntity } from './../entities/todo.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsString } from '@nestjs/class-validator';

export class UpdateTodoDto extends OmitType(TodoEntity, ['id', 'userId']) {
  @ApiProperty({
    example: true,
    description: 'Is completed',
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    example: 'do smth',
    description: 'title of a todo',
  })
  @IsString()
  title: string;
}
