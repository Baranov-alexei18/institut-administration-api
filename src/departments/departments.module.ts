import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';

@Module({
  imports: [DatabaseModule, DepartmentsModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
