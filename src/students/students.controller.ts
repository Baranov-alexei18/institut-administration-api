import { Controller, Get, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { GetStudentsDto } from './dto/get-students.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  getStudents(@Query() query: GetStudentsDto) {
    return this.studentsService.getStudents(query);
  }
}
