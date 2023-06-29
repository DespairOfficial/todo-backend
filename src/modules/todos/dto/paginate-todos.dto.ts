import { Task } from '@prisma/client';
import { PaginationConfig } from '../../../base/paginationConfig';

export class PaginateTodosDto extends PaginationConfig<Task> {}
