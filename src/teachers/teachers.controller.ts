import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { GetTeachersDto } from './dto/get-teachers.dto';
import { GetTeachersByDisciplineDto } from './dto/get-teachers-by-discipline.dto';
import { GetTeachersByLessonsDto } from './dto/get-teachers-by-lessons.dto';
import { GetExaminersDto } from './dto/get-examiners.dto';
import { GetThesisSupervisorsDto } from './dto/get-thesis-supervisors.dto';
import { GetWorkloadDto } from './dto/get-workload.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private service: TeachersService) {}

  @Get()
  getTeachers(@Query() query: GetTeachersDto) {
    return this.service.getTeachers(query);
  }

  @Get('by-discipline')
  getByDiscipline(@Query() query: GetTeachersByDisciplineDto) {
    return this.service.getTeachersByDiscipline(query);
  }

  @Get('by-lessons')
  getByLessons(@Query() query: GetTeachersByLessonsDto) {
    return this.service.getTeachersByLessons(query);
  }

  @Get('examiners')
  getExaminers(@Query() query: GetExaminersDto) {
    return this.service.getExaminers(query);
  }

  @Get('thesis-supervisors')
  getThesisSupervisors(@Query() query: GetThesisSupervisorsDto) {
    return this.service.getThesisSupervisors(query);
  }

  @Get('workload')
  getWorkload(@Query() query: GetWorkloadDto) {
    return this.service.getWorkload(query);
  }

  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTeacherDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
