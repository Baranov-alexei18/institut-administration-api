import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DissertationsController } from './dissertations.controller';
import { DissertationsService } from './dissertations.service';

@Module({
  imports: [DatabaseModule, DissertationsModule],
  controllers: [DissertationsController],
  providers: [DissertationsService],
})
export class DissertationsModule {}
