import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetSessionStudentsDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  semester: number;

  @ApiPropertyOptional({ example: 2024 })
  @Type(() => Number)
  year: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  groupId?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  course?: number;

  @ApiPropertyOptional({ example: 3 })
  @Type(() => Number)
  facultyId?: number;

  @ApiProperty({ enum: ['excellent', 'no_threes', 'no_twos'], example: 'excellent' })
  type: 'excellent' | 'no_threes' | 'no_twos';
}
