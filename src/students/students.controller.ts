import { Controller, Get, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { GetStudentsDto } from './dto/get-students.dto';
import { GetStudentsByAssessmentDto } from './dto/get-students-by-assessment.dto';
import { GetSessionStudentsDto } from './dto/get-session-students.dto';
import { GetStudentsByTeacherDto } from '../teachers/dto/get-students-by-teacher.dto';
import { GetThesesDto } from './dto/get-theses.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  getStudents(@Query() query: GetStudentsDto) {
    return this.studentsService.getStudents(query);
  }

  @Get('by-assessment')
  getByAssessment(@Query() query: GetStudentsByAssessmentDto) {
    return this.studentsService.getStudentsByAssessment(query);
  }

  @Get('session')
  getSessionStudents(@Query() query: GetSessionStudentsDto) {
    return this.studentsService.getSessionStudents(query);
  }

  @Get('by-teacher')
  getStudentsByTeacher(@Query() query: GetStudentsByTeacherDto) {
    return this.studentsService.getStudentsByTeacher(query);
  }

  @Get('theses')
  getTheses(@Query() query: GetThesesDto) {
    return this.studentsService.getTheses(query);
  }
}
