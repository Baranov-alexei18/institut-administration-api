import { Controller, Get } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('groups')
  getGroups() {
    return this.dictionaryService.getGroups();
  }

  @Get('departments')
  getDepartments() {
    return this.dictionaryService.getDepartments();
  }

  @Get('disciplines')
  getDisciplines() {
    return this.dictionaryService.getDisciplines();
  }

  @Get('faculties')
  getFaculties() {
    return this.dictionaryService.getFaculties();
  }

  @Get('lesson-types')
  getLessonTypes() {
    return this.dictionaryService.getLessonTypes();
  }

  @Get('teacher-categories')
  getTeacherCategories() {
    return this.dictionaryService.getTeacherCategories();
  }
}
