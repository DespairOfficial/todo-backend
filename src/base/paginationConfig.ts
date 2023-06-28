import { Type } from '@nestjs/class-transformer';
import { IsInt, IsOptional, IsString, Min } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class PaginationConfig<T> {
  @ApiProperty({
    example: 2,
    description: 'How much to skip (offset)',
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    example: 1,
    description: 'How much to take per page (limit)',
  })
  @Type(() => Number)
  @IsInt()
  limit: number;

  @ApiProperty({
    required: false,
    example: 'id',
    description: 'column to sort by',
  })
  @IsString()
  @IsOptional()
  orderBy: string;

  @ApiProperty({
    required: false,
    example: 'desc',
    description: 'Descending sort',
  })
  @IsString()
  @IsOptional()
  direction: 'asc' | 'desc';
}
