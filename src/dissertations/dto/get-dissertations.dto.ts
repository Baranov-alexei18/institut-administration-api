import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetDissertationsDto {
  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(Number);
    if (value !== undefined) return [Number(value)];
    return undefined;
  })
  departmentIds?: number[];

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(Number);
    if (value !== undefined) return [Number(value)];
    return undefined;
  })
  facultyIds?: number[];

  @ApiPropertyOptional({ example: 'phd' })
  @IsOptional()
  type?: 'phd' | 'doctor';

  @ApiPropertyOptional({ example: '2000-01-01' })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  to?: string;
}
