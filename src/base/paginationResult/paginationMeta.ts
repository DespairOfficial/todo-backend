import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({
    example: 23,
    description: 'Total count of arguments found',
  })
  total: number;
}
