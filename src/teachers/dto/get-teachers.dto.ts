import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetTeachersDto {
  @ApiPropertyOptional({ example: 'Engineering' })
  @IsOptional()
  faculty?: string;

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => Number(v)) : value ? [Number(value)] : undefined,
  )
  @IsNumber({}, { each: true })
  departmentIds?: number[];

  @ApiPropertyOptional({ example: ['professor', 'assistant'] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : undefined))
  categories?: string[];

  @ApiPropertyOptional({ example: 'male' })
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @Type(() => Number)
  minAge?: number;

  @ApiPropertyOptional({ example: 65 })
  @IsOptional()
  @Type(() => Number)
  maxAge?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  minChildren?: number;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @Type(() => Number)
  minSalary?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isPhd?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isDoctor?: boolean;

  @ApiPropertyOptional({ example: '2010-01-01' })
  @IsOptional()
  defenseFrom?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  defenseTo?: string;
}
