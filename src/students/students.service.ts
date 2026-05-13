import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetStudentsDto } from './dto/get-students.dto';
import { GetStudentsByAssessmentDto } from './dto/get-students-by-assessment.dto';
import { GetSessionStudentsDto } from './dto/get-session-students.dto';
import { GetStudentsByTeacherDto } from '../teachers/dto/get-students-by-teacher.dto';
import { GetThesesDto } from './dto/get-theses.dto';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.query('SELECT * FROM students');
  }

  // Задание 1
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

  // Задание 7
  async getStudentsByAssessment(filters: GetStudentsByAssessmentDto) {
    let query = `
    SELECT DISTINCT
      s.id,
      p.first_name,
      p.last_name,
      g.name AS group_name,
      d.name AS discipline_name,
      a.assessment_type,
      a.grade,
      COUNT(*) OVER() AS total_count
    FROM assessments a
    JOIN students s ON s.id = a.student_id
    JOIN persons p ON p.id = s.id
    JOIN groups g ON g.id = s.group_id
    JOIN disciplines d ON d.id = a.discipline_id
    WHERE 1=1
  `;

    const params: any[] = [];
    let i = 1;

    // 🔥 группы
    if (filters.groupId) {
      query += ` AND g.id = $${i++}`;
      params.push(filters.groupId);
    }

    // 🔥 дисциплина
    if (filters.disciplineId) {
      query += ` AND d.id = $${i++}`;
      params.push(filters.disciplineId);
    }

    // 🔥 тип (экзамен/зачет)
    if (filters.type) {
      query += ` AND a.assessment_type = $${i++}`;
      params.push(filters.type);
    }

    // 🔥 оценка
    if (filters.grade !== undefined) {
      query += ` AND a.grade = $${i++}`;
      params.push(filters.grade);
    }

    const result = await this.db.query(query, params);

    return result.rows;
  }

  // Задание 8
  async getSessionStudents(filters: GetSessionStudentsDto) {
    let query = `
    SELECT
      s.id,
      p.first_name,
      p.last_name,
      g.name AS group_name,
      g.course,
      a.semester,
      f.name AS faculty_name,
      COUNT(*) OVER() AS total_count

    FROM assessments a
    JOIN students s ON s.id = a.student_id
    JOIN persons p ON p.id = s.id
    JOIN groups g ON g.id = s.group_id
    JOIN faculties f ON f.id = g.faculty_id

    WHERE 1=1
  `;

    const params: any[] = [];
    let idx = 1;

    // semester
    if (filters.semester) {
      query += ` AND a.semester = $${idx++}`;
      params.push(filters.semester);
    }

    // year
    if (filters.year) {
      query += ` AND a.year = $${idx++}`;
      params.push(filters.year);
    }

    // group
    if (filters.groupId) {
      query += ` AND g.id = $${idx++}`;
      params.push(filters.groupId);
    }

    // course
    if (filters.course) {
      query += ` AND g.course = $${idx++}`;
      params.push(filters.course);
    }

    // faculty
    if (filters.facultyId) {
      query += ` AND f.id = $${idx++}`;
      params.push(filters.facultyId);
    }

    query += `
    GROUP BY
      s.id,
      p.first_name,
      p.last_name,
      a.semester,
      g.name,
      g.course,
      f.name
  `;

    // excellent only
    if (filters.type === 'excellent') {
      query += ` HAVING MIN(a.grade) = 5`;
    }

    // without threes
    if (filters.type === 'no_threes') {
      query += ` HAVING MIN(a.grade) >= 4`;
    }

    // without twos
    if (filters.type === 'no_twos') {
      query += ` HAVING MIN(a.grade) >= 3`;
    }

    query += `
    ORDER BY
      p.last_name,
      p.first_name
  `;

    const result = await this.db.query(query, params);

    return result.rows;
  }

  // Задание 10
  async getStudentsByTeacher(filters: GetStudentsByTeacherDto) {
    let query = `
    SELECT DISTINCT
      s.id,
      p.first_name,
      p.last_name,
      g.name AS group_name,
      COUNT(*) OVER() AS total_count
    FROM assessments a
    JOIN students s ON s.id = a.student_id
    JOIN persons p ON p.id = s.id
    JOIN groups g ON g.id = s.group_id
    WHERE a.assessment_type = 'exam'
  `;

    const params: any[] = [];
    let i = 1;

    // 🔥 ОСНОВНАЯ ЛОГИКА (группы ИЛИ преподаватель)
    if (filters.groupIds || filters.teacherId) {
      query += ` AND (`;

      if (filters.groupIds) {
        const groups = Array.isArray(filters.groupIds) ? filters.groupIds : [filters.groupIds];

        query += ` g.id = ANY($${i++})`;
        params.push(groups);
      }

      if (filters.teacherId) {
        if (filters.groupIds) query += ` OR`;

        query += ` a.teacher_id = $${i++}`;
        params.push(filters.teacherId);
      }

      query += `)`;
    }

    // 🔥 дисциплины
    if (filters.disciplineIds) {
      const disciplines = Array.isArray(filters.disciplineIds)
        ? filters.disciplineIds
        : [filters.disciplineIds];

      query += ` AND a.discipline_id = ANY($${i++})`;
      params.push(disciplines);
    }

    // 🔥 семестры
    if (filters.semesters) {
      const semesters = Array.isArray(filters.semesters) ? filters.semesters : [filters.semesters];

      query += ` AND a.semester = ANY($${i++})`;
      params.push(semesters);
    }

    // 🔥 период
    if (filters.fromYear) {
      query += ` AND a.year >= $${i++}`;
      params.push(filters.fromYear);
    }

    if (filters.toYear) {
      query += ` AND a.year <= $${i++}`;
      params.push(filters.toYear);
    }

    // 🔥 оценка
    if (filters.grade !== undefined) {
      query += ` AND a.grade = $${i++}`;
      params.push(filters.grade);
    }

    const result = await this.db.query(query, params);

    return result.rows;
  }

  // Задание 11
  async getTheses(filters: GetThesesDto) {
    let query = `
    SELECT
      s.id,
      p.first_name,
      p.last_name,

      t.topic AS thesis_title,

      d.name AS department_name,

      tp.first_name AS teacher_first_name,
      tp.last_name AS teacher_last_name,

      COUNT(*) OVER() AS total_count

    FROM theses t

    JOIN students s ON s.id = t.student_id
    JOIN persons p ON p.id = s.id

    LEFT JOIN departments d ON d.id = t.department_id

    LEFT JOIN teachers tr ON tr.id = t.teacher_id
    LEFT JOIN persons tp ON tp.id = tr.id

    WHERE 1=1
  `;

    const params: any[] = [];
    let i = 1;

    // department
    if (filters.departmentId) {
      query += ` AND t.department_id = $${i++}`;
      params.push(filters.departmentId);
    }

    // teacher
    if (filters.teacherId) {
      query += ` AND t.teacher_id = $${i++}`;
      params.push(filters.teacherId);
    }

    query += `
    ORDER BY
      p.last_name,
      p.first_name
  `;

    const result = await this.db.query(query, params);

    return result.rows;
  }

  async create(dto: CreateStudentDto) {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // 🔥 persons
      const personResult = await client.query(
        `
      INSERT INTO persons (
        first_name,
        last_name,
        gender,
        birth_date,
        children_count
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
        [dto.firstName, dto.lastName, dto.gender, dto.birthDate, dto.childrenCount],
      );

      const personId = personResult.rows[0].id;

      // 🔥 students
      const studentResult = await client.query(
        `
      INSERT INTO students (
        id,
        group_id,
        scholarship_amount
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
        [personId, dto.groupId, dto.scholarshipAmount],
      );

      await client.query('COMMIT');

      return studentResult.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async update(id: number, dto: CreateStudentDto) {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // 🔥 update persons
      await client.query(
        `
      UPDATE persons
      SET
        first_name = $1,
        last_name = $2,
        gender = $3,
        birth_date = $4,
        children_count = $5
      WHERE id = $6
      `,
        [dto.firstName, dto.lastName, dto.gender, dto.birthDate, dto.childrenCount, id],
      );

      // 🔥 update students
      const result = await client.query(
        `
      UPDATE students
      SET
        group_id = $1,
        scholarship_amount = $2
      WHERE id = $3
      RETURNING *
      `,
        [dto.groupId, dto.scholarshipAmount, id],
      );

      await client.query('COMMIT');

      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async remove(id: number) {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // 🔥 сначала students
      await client.query(
        `
      DELETE FROM students
      WHERE id = $1
      `,
        [id],
      );

      // 🔥 потом persons
      await client.query(
        `
      DELETE FROM persons
      WHERE id = $1
      `,
        [id],
      );

      await client.query('COMMIT');

      return {
        message: 'Student deleted successfully',
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
