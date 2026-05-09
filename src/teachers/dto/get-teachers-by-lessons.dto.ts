import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetTeachersByLessonsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  groupId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  course?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  facultyId?: number;

  @ApiPropertyOptional({ example: 'lecture' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : undefined))
  lessonTypes?: string[]; // ['lecture', 'seminar']

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  semester?: number;

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @Type(() => Number)
  fromYear?: number;

  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @Type(() => Number)
  toYear?: number;
}
