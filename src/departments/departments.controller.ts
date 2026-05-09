import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { GetDepartmentsDto } from './dto/get-departments.dto';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get('teaching')
  getTeachingDepartments(@Query() query: GetDepartmentsDto) {
    return this.service.getTeachingDepartments(query);
  }
}
