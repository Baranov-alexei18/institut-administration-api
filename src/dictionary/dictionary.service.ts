import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DictionaryService {
  constructor(private db: DatabaseService) {}

  async getGroups() {
    const result = await this.db.query(`
      SELECT
        g.id,
        g.name,
        g.course,
        f.name AS faculty_name
      FROM groups g
      JOIN faculties f ON f.id = g.faculty_id
      ORDER BY g.name
    `);

    return result.rows;
  }

  async getDepartments() {
    const result = await this.db.query(`
      SELECT
        d.id,
        d.name,
        f.name AS faculty_name
      FROM departments d
      JOIN faculties f ON f.id = d.faculty_id
      ORDER BY d.name
    `);

    return result.rows;
  }

  async getDisciplines() {
    const result = await this.db.query(`
      SELECT *
      FROM disciplines
      ORDER BY name
    `);

    return result.rows;
  }

  async getFaculties() {
    const result = await this.db.query(`
      SELECT *
      FROM faculties
      ORDER BY name
    `);

    return result.rows;
  }

  async getLessonTypes() {
    const result = await this.db.query(`
      SELECT *
      FROM lesson_types
      ORDER BY name
    `);

    return result.rows;
  }

  async getTeacherCategories() {
    const result = await this.db.query(`
      SELECT *
      FROM teacher_categories
      ORDER BY id
    `);

    return result.rows;
  }
}
