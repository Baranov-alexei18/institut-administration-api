import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetStudentsDto {
  @ApiPropertyOptional({ example: 'Engineering' })
  @IsOptional()
  @IsString()
  faculty?: string;

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(Number);
    if (value !== undefined) return [Number(value)];
    return undefined;
  })
  courses?: number[];

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: 'male' | 'female';

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAge?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAge?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minChildren?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minScholarship?: number;
}
