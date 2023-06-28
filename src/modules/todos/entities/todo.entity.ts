import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@prisma/client';

export class TodoEntity implements Task {

	@ApiProperty({
    example: '1',
    description: 'Id of user',
  })
  id: number;

	@ApiProperty({
    example: '2',
    description: 'Id of a user',
  })
  userId: number;

	@ApiProperty({
    example: true,
    description: 'Is completed',
  })
  status: boolean;

	@ApiProperty({
    example: 'do smth',
    description: 'title of a todo',
  })
  title: string;
}
