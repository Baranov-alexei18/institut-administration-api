import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetTeachersDto } from './dto/get-teachers.dto';
import { GetTeachersByDisciplineDto } from './dto/get-teachers-by-discipline.dto';
import { GetTeachersByLessonsDto } from './dto/get-teachers-by-lessons.dto';
import { GetExaminersDto } from './dto/get-examiners.dto';
import { GetThesisSupervisorsDto } from './dto/get-thesis-supervisors.dto';
import { GetWorkloadDto } from './dto/get-workload.dto';

@Injectable()
export class TeachersService {
  constructor(private db: DatabaseService) {}

  // Задание 2
  async getTeachers(filters: GetTeachersDto) {
    let query = `
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.gender,
        p.birth_date,
        p.children_count,

        d.name AS department_name,
        f.name AS faculty_name,
        tc.name AS category,

        t.salary,

        COUNT(DISTINCT dis.id) FILTER (WHERE dis.type = 'phd') AS phd_count,
        COUNT(DISTINCT dis.id) FILTER (WHERE dis.type = 'doctor') AS doctor_count,

        COUNT(*) OVER() AS total_count

      FROM teachers t
      JOIN persons p ON p.id = t.id
      JOIN departments d ON d.id = t.department_id
      JOIN faculties f ON f.id = d.faculty_id
      JOIN teacher_categories tc ON tc.id = t.category_id

      LEFT JOIN dissertations dis ON dis.teacher_id = t.id

      WHERE 1=1
    `;

    const params: any[] = [];
    let i = 1;

    // 🔥 фильтры

    if (filters.faculty) {
      query += ` AND f.name = $${i++}`;
      params.push(filters.faculty);
    }

    if (filters.departmentIds) {
      const departmentIds = Array.isArray(filters.departmentIds)
        ? filters.departmentIds
        : [filters.departmentIds];

      query += ` AND d.id = ANY($${i++})`;
      params.push(departmentIds);
    }

    if (filters.categories) {
      const categoriesIds = Array.isArray(filters.categories)
        ? filters.categories
        : [filters.categories];

      query += ` AND d.id = ANY($${i++})`;
      params.push(categoriesIds);
    }

    if (filters.gender) {
      query += ` AND p.gender = $${i++}`;
      params.push(filters.gender);
    }

    if (filters.minChildren !== undefined) {
      query += ` AND p.children_count >= $${i++}`;
      params.push(filters.minChildren);
    }

    if (filters.minSalary !== undefined) {
      query += ` AND t.salary >= $${i++}`;
      params.push(filters.minSalary);
    }

    if (filters.minAge) {
      query += ` AND DATE_PART('year', AGE(p.birth_date)) >= $${i++}`;
      params.push(filters.minAge);
    }

    if (filters.maxAge) {
      query += ` AND DATE_PART('year', AGE(p.birth_date)) <= $${i++}`;
      params.push(filters.maxAge);
    }

    if (filters.defenseFrom) {
      query += ` AND dis.defense_date >= $${i++}`;
      params.push(filters.defenseFrom);
    }

    if (filters.defenseTo) {
      query += ` AND dis.defense_date <= $${i++}`;
      params.push(filters.defenseTo);
    }

    query += `
      GROUP BY 
        p.id, d.name, f.name, tc.name, t.salary
    `;

    // 🔥 фильтр по наличию степеней (после GROUP BY)

    const having: string[] = [];

    if (filters.isPhd) {
      having.push(`COUNT(*) FILTER (WHERE dis.type = 'phd') > 0`);
    }

    if (filters.isDoctor) {
      having.push(`COUNT(*) FILTER (WHERE dis.type = 'doctor') > 0`);
    }

    if (having.length) {
      query += ` HAVING ` + having.join(' AND ');
    }

    const result = await this.db.query(query, params);

    return {
      total: result.rows[0]?.total_count || 0,
      data: result.rows,
    };
  }

  // Задание 5
  async getTeachersByDiscipline(filters: GetTeachersByDisciplineDto) {
    let query = `
    SELECT DISTINCT
      t.id,
      p.first_name,
      p.last_name,
      d.name AS discipline_name,
      g.name AS group_name,
      f.name AS faculty_name,
      COUNT(*) OVER() AS total_count
    FROM teaching_assignments ta
    JOIN teachers t ON t.id = ta.teacher_id
    JOIN persons p ON p.id = t.id
    JOIN disciplines d ON d.id = ta.discipline_id
    JOIN groups g ON g.id = ta.group_id
    JOIN faculties f ON f.id = g.faculty_id
    WHERE 1=1
  `;

    const params: any[] = [];
    let i = 1;

    if (filters.disciplineId) {
      query += ` AND d.id = $${i++}`;
      params.push(filters.disciplineId);
    }

    if (filters.groupId) {
      query += ` AND g.id = $${i++}`;
      params.push(filters.groupId);
    }

    if (filters.course) {
      query += ` AND g.course = $${i++}`;
      params.push(filters.course);
    }

    if (filters.facultyId) {
      query += ` AND f.id = $${i++}`;
      params.push(filters.facultyId);
    }

    const result = await this.db.query(query, params);

    return result.rows;
  }

  // Задание 6
  async getTeachersByLessons(filters: GetTeachersByLessonsDto) {
    let query = `
    SELECT DISTINCT
      t.id,
      p.first_name,
      p.last_name,
      lt.name AS lesson_type,
      g.name AS group_name,
      f.name AS faculty_name,
      COUNT(*) OVER() AS total_count
    FROM teaching_assignments ta
    JOIN teachers t ON t.id = ta.teacher_id
    JOIN persons p ON p.id = t.id
    JOIN lesson_types lt ON lt.id = ta.lesson_type_id
    JOIN groups g ON g.id = ta.group_id
    JOIN faculties f ON f.id = g.faculty_id
    WHERE 1=1
  `;

    const params: any[] = [];
    let i = 1;

    // 🔥 фильтр по типам занятий
    if (filters.lessonTypes?.length) {
      const lessonTypeNames = Array.isArray(filters.lessonTypes)
        ? filters.lessonTypes
        : [filters.lessonTypes];
      query += ` AND lt.name = ANY($${i++})`;
      params.push(lessonTypeNames);
    }

    // 🔥 группа
    if (filters.groupId) {
      query += ` AND g.id = $${i++}`;
      params.push(filters.groupId);
    }

    // 🔥 курс
    if (filters.course) {
      query += ` AND g.course = $${i++}`;
      params.push(filters.course);
    }

    // 🔥 факультет
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

    return result.rows;
  }

  // Задание 9
  async getExaminers(filters: GetExaminersDto) {
    let query = `
    SELECT DISTINCT
      t.id,
      p.first_name,
      p.last_name,
      COUNT(*) OVER() AS total_count
    FROM assessments a
    JOIN teachers t ON t.id = a.teacher_id
    JOIN persons p ON p.id = t.id
    JOIN students s ON s.id = a.student_id
    JOIN groups g ON g.id = s.group_id
    WHERE a.assessment_type = 'exam'
  `;

    const params: any[] = [];
    let i = 1;

    // 🔥 группы
    if (filters.groupIds?.length) {
      const groupsIds = Array.isArray(filters.groupIds) ? filters.groupIds : [filters.groupIds];

      query += ` AND g.id = ANY($${i++})`;
      params.push(groupsIds);
    }

    // 🔥 дисциплины
    if (filters.disciplineIds?.length) {
      const disciplines = Array.isArray(filters.disciplineIds)
        ? filters.disciplineIds
        : [filters.disciplineIds];

      query += ` AND a.discipline_id = ANY($${i++})`;
      params.push(disciplines);
    }

    // 🔥 семестр
    if (filters.semester) {
      query += ` AND a.semester = $${i++}`;
      params.push(filters.semester);
    }

    // 🔥 год
    if (filters.year) {
      query += ` AND a.year = $${i++}`;
      params.push(filters.year);
    }

    const result = await this.db.query(query, params);

    return result.rows;
  }

  // Задание 12
  async getThesisSupervisors(filters: GetThesisSupervisorsDto) {
    let query = `
    SELECT
      tr.id,
      p.first_name,
      p.last_name,
      tc.name AS category,
      COUNT(DISTINCT t.id) AS theses_count,
      COUNT(*) OVER() AS total_count
    FROM theses t
    JOIN teachers tr ON tr.id = t.teacher_id
    JOIN persons p ON p.id = tr.id
    JOIN teacher_categories tc ON tc.id = tr.category_id
    JOIN departments d ON d.id = t.department_id
    JOIN faculties f ON f.id = d.faculty_id
    WHERE 1=1
  `;

    const params: any[] = [];
    let i = 1;

    // 🔥 кафедра ИЛИ факультет
    if (filters.departmentId || filters.facultyId) {
      query += ` AND (`;

      if (filters.departmentId) {
        query += ` d.id = $${i++}`;
        params.push(filters.departmentId);
      }

      if (filters.facultyId) {
        if (filters.departmentId) query += ` OR`;
        query += ` f.id = $${i++}`;
        params.push(filters.facultyId);
      }

      query += `)`;
    }

    // 🔥 категории
    if (filters.categoryIds) {
      const categories = Array.isArray(filters.categoryIds)
        ? filters.categoryIds
        : [filters.categoryIds];

      query += ` AND tr.category_id = ANY($${i++})`;
      params.push(categories);
    }

    query += `
    GROUP BY tr.id, p.first_name, p.last_name, tc.name
  `;

    const result = await this.db.query(query, params);

    return result.rows;
  }

  // Задание 13
  async getWorkload(filters: GetWorkloadDto) {
    let query = `
    SELECT
      t.id,
      p.first_name,
      p.last_name,
      d.name AS discipline_name,
      lt.name AS lesson_type,
      SUM(ta.hours) AS hours,
      SUM(SUM(ta.hours)) OVER (PARTITION BY t.id) AS total_hours
    FROM teaching_assignments ta
    JOIN teachers t ON t.id = ta.teacher_id
    JOIN persons p ON p.id = t.id
    JOIN disciplines d ON d.id = ta.discipline_id
    JOIN lesson_types lt ON lt.id = ta.lesson_type_id
    JOIN departments dep ON dep.id = t.department_id
    WHERE ta.semester = $1
  `;

    const params: any[] = [filters.semester];
    let i = 2;

    // 🔥 преподаватель ИЛИ кафедра
    if (filters.teacherId || filters.departmentId) {
      query += ` AND (`;

      if (filters.teacherId) {
        query += ` t.id = $${i++}`;
        params.push(filters.teacherId);
      }

      if (filters.departmentId) {
        if (filters.teacherId) query += ` OR`;
        query += ` dep.id = $${i++}`;
        params.push(filters.departmentId);
      }

      query += `)`;
    }

    query += `
    GROUP BY
      t.id,
      p.first_name,
      p.last_name,
      d.name,
      lt.name
  `;

    const result = await this.db.query(query, params);

    return result.rows;
  }
}
