import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string | undefined;

  @ApiProperty()
  password: string | undefined;
}
