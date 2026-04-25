import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetStudentsDto } from './dto/get-students.dto';

@Injectable()
export class StudentsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.query('SELECT * FROM students');
  }

  async getStudents(filters: GetStudentsDto) {
    let query = `
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.gender,
        p.birth_date,
        p.children_count,
        g.name AS group_name,
        g.course,
        f.name AS faculty_name,
        s.scholarship_amount,
        COUNT(*) OVER() AS total_count
      FROM students s
      JOIN persons p ON p.id = s.id
      JOIN groups g ON g.id = s.group_id
      JOIN faculties f ON f.id = g.faculty_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let idx = 1;

    // 🔥 динамические фильтры

    if (filters.faculty) {
      query += ` AND f.name = $${idx++}`;
      params.push(filters.faculty);
    }

    if (filters.courses) {
      const courses = Array.isArray(filters.courses) ? filters.courses : [filters.courses];

      query += ` AND g.course = ANY($${idx++})`;
      params.push(courses);
    }

    if (filters.gender) {
      query += ` AND p.gender = $${idx++}`;
      params.push(filters.gender);
    }

    if (filters.minChildren !== undefined) {
      query += ` AND p.children_count >= $${idx++}`;
      params.push(filters.minChildren);
    }

    if (filters.minScholarship !== undefined) {
      query += ` AND s.scholarship_amount >= $${idx++}`;
      params.push(filters.minScholarship);
    }

    if (filters.minAge) {
      query += ` AND DATE_PART('year', AGE(p.birth_date)) >= $${idx++}`;
      params.push(filters.minAge);
    }

    if (filters.maxAge) {
      query += ` AND DATE_PART('year', AGE(p.birth_date)) <= $${idx++}`;
      params.push(filters.maxAge);
    }

    const result = await this.db.query(query, params);

    return result.rows;
  }
}
