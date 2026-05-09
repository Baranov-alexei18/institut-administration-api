import { ApiProperty } from '@nestjs/swagger';

class DissertationDto {
  @ApiProperty({ example: 'candidate' })
  type!: string;

  @ApiProperty()
  topic!: string;

  @ApiProperty()
  defenseDate!: string;
}

export class CreateTeacherDto {
  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  gender!: string;

  @ApiProperty()
  birthDate!: string;

  @ApiProperty()
  childrenCount!: number;

  @ApiProperty()
  departmentId!: number;

  @ApiProperty()
  categoryId!: number;

  @ApiProperty()
  salary!: number;

  @ApiProperty()
  isPostgraduateStudent!: boolean;

  @ApiProperty({
    type: [DissertationDto],
    required: false,
  })
  dissertations?: DissertationDto[];
}
