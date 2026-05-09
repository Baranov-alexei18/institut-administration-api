import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiPropertyOptional()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

  @ApiPropertyOptional({ example: 'male' })
  gender: string;

  @ApiPropertyOptional()
  birthDate: string;

  @ApiPropertyOptional()
  childrenCount: number;

  @ApiPropertyOptional()
  groupId: number;

  @ApiPropertyOptional()
  scholarshipAmount: number;
}
