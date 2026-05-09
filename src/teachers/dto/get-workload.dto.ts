import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWorkloadDto {
  @ApiProperty()
  @Type(() => Number)
  semester: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  teacherId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  departmentId?: number;
}
