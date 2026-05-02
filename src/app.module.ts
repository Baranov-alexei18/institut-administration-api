import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StudentsController } from './students/students.controller';
import { StudentsModule } from './students/students.module';
import { TeachersService } from './teachers/teachers.service';
import { TeachersModule } from './teachers/teachers.module';
import { DissertationsController } from './dissertations/dissertations.controller';
import { DissertationsService } from './dissertations/dissertations.service';
import { DissertationsModule } from './dissertations/dissertations.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    StudentsModule,
    TeachersModule,
    DissertationsModule,
    DepartmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
