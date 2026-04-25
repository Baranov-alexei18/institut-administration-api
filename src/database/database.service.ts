import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}
