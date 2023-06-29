import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({
    example: 23,
    description: 'Total count of arguments found',
  })
  total: number;

  @ApiProperty({
    example: 2,
  })
  first: number;

  @ApiProperty({
    example: 1,
  })
  previous: number;

  @ApiProperty({
    example: 1,
  })
  current: number;

  @ApiProperty({
    example: 2,
  })
  next: number;

  @ApiProperty({
    example: 2,
  })
  last: number;

	@ApiProperty({
    example: 5,
  })
  limit: number;
}
