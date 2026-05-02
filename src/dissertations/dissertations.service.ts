import { Injectable } from '@nestjs/common';
import { GetDissertationsDto } from './dto/get-dissertations.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DissertationsService {
  constructor(private db: DatabaseService) {}

  // Задание 3
  async getDissertations(filters: GetDissertationsDto) {
    let query = `
    SELECT 
      dis.id,
      dis.type,
      dis.defense_date,

      p.first_name,
      p.last_name,

      d.name AS department_name,
      f.name AS faculty_name

    FROM dissertations dis
    JOIN teachers t ON t.id = dis.teacher_id
    JOIN persons p ON p.id = t.id
    JOIN departments d ON d.id = t.department_id
    JOIN faculties f ON f.id = d.faculty_id

    WHERE 1=1
  `;

    const params: any[] = [];
    let i = 1;

    if (filters.departmentIds) {
      const departmentIds = Array.isArray(filters.departmentIds)
        ? filters.departmentIds
        : [filters.departmentIds];

      query += ` AND d.id = ANY($${i++})`;
      params.push(departmentIds);
    }

    if (filters.facultyIds) {
      const facultyIds = Array.isArray(filters.facultyIds)
        ? filters.facultyIds
        : [filters.facultyIds];

      query += ` AND f.id = ANY($${i++})`;
      params.push(facultyIds);
    }

    if (filters.type) {
      query += ` AND dis.type = $${i++}`;
      params.push(filters.type);
    }

    if (filters.from) {
      query += ` AND dis.defense_date >= $${i++}`;
      params.push(filters.from);
    }

    if (filters.to) {
      query += ` AND dis.defense_date <= $${i++}`;
      params.push(filters.to);
    }

    const result = await this.db.query(query, params);

    return result.rows;
  }

  async countDissertations(filters: GetDissertationsDto) {
    let query = `
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE dis.type = 'phd') AS phd_count,
      COUNT(*) FILTER (WHERE dis.type = 'doctor') AS doctor_count
    FROM dissertations dis
    JOIN teachers t ON t.id = dis.teacher_id
    JOIN departments d ON d.id = t.department_id
    JOIN faculties f ON f.id = d.faculty_id
    WHERE 1=1
  `;

    const params: any[] = [];
    let i = 1;

    if (filters.departmentIds) {
      const departmentIds = Array.isArray(filters.departmentIds)
        ? filters.departmentIds
        : [filters.departmentIds];

      query += ` AND d.id = ANY($${i++})`;
      params.push(departmentIds);
    }

    if (filters.facultyIds) {
      const facultyIds = Array.isArray(filters.facultyIds)
        ? filters.facultyIds
        : [filters.facultyIds];

      query += ` AND f.id = ANY($${i++})`;
      params.push(facultyIds);
    }

    if (filters.type) {
      query += ` AND dis.type = $${i++}`;
      params.push(filters.type);
    }

    if (filters.from) {
      query += ` AND dis.defense_date >= $${i++}`;
      params.push(filters.from);
    }

    if (filters.to) {
      query += ` AND dis.defense_date <= $${i++}`;
      params.push(filters.to);
    }

    const result = await this.db.query(query, params);

    return result.rows[0];
  }
}
