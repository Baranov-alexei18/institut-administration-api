import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(email: string, password: string) {
    const result = await this.pool.query(
      `INSERT INTO users (email, password)
       VALUES ($1, $2)
       RETURNING *`,
      [email, password],
    );

    return result.rows[0];
  }

  async findByEmail(email: string) {
    const result = await this.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM users');
    return result.rows;
  }

  async findUserById(id: number) {
    const result = await this.pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    return result.rows[0];
  }

  async removeUser(id: number) {
    const result = await this.pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);

    return result.rows[0];
  }
}
