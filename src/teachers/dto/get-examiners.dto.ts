import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetExaminersDto {
  @ApiPropertyOptional({ example: [1], type: [Number] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : undefined,
  )
  @Type(() => Array<Number>)
  groupIds?: number[];

  @ApiPropertyOptional({ example: [1], type: [Number] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : undefined,
  )
  @Type(() => Array<Number>)
  disciplineIds?: number[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  semester?: number;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @Type(() => Number)
  year?: number;
}
