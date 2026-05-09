import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetStudentsByTeacherDto {
  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : undefined,
  )
  groupIds?: number[];

  @ApiPropertyOptional({ example: 51 })
  @IsOptional()
  @Type(() => Number)
  teacherId?: number;

  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : undefined,
  )
  disciplineIds?: number[];

  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : undefined,
  )
  semesters?: number[];

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @Type(() => Number)
  fromYear?: number;

  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @Type(() => Number)
  toYear?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  grade?: number;
}
