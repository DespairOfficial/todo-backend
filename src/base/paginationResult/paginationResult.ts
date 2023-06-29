import { PaginationMeta } from './paginationMeta';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResult<T> {
  @ApiProperty({
    type: PaginationMeta,
  })
  meta: PaginationMeta;

  @ApiProperty({
    type: [{}],
  })
  body: T[];

	
}
