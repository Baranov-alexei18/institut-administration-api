import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetStudentsByAssessmentDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  groupId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  disciplineId?: number;

  @ApiPropertyOptional({ example: 'exam' })
  @IsOptional()
  type?: 'exam' | 'credit';

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  grade?: number;
}
