import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetDepartmentsDto } from './dto/get-departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(private db: DatabaseService) {}

  // Задание 4
  async getTeachingDepartments(filters: GetDepartmentsDto) {
    let query = `
      SELECT DISTINCT
        d.id,
        d.name,
        f.name AS faculty_name
      FROM teaching_assignments ta
      JOIN departments d ON d.id = ta.department_id
      JOIN groups g ON g.id = ta.group_id
      JOIN faculties f ON f.id = d.faculty_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let i = 1;

    // 🔥 фильтр по группе
    if (filters.groupId) {
      query += ` AND g.id = $${i++}`;
      params.push(filters.groupId);
    }

    if (filters.facultyId) {
      query += ` AND f.id = $${i++}`;
      params.push(filters.facultyId);
    }

    // 🔥 семестр
    if (filters.semester) {
      query += ` AND ta.semester = $${i++}`;
      params.push(filters.semester);
    }

    // 🔥 период
    if (filters.fromYear) {
      query += ` AND ta.year >= $${i++}`;
      params.push(filters.fromYear);
    }

    if (filters.toYear) {
      query += ` AND ta.year <= $${i++}`;
      params.push(filters.toYear);
    }

    const result = await this.db.query(query, params);

    return {
      total: result.rowCount,
      data: result.rows,
    };
  }
}
