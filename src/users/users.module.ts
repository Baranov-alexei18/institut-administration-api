import { Module } from '@nestjs/common';

import { Users } from './users';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  providers: [Users, UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
