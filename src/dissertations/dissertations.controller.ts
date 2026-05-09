import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DissertationsService } from './dissertations.service';
import { GetDissertationsDto } from './dto/get-dissertations.dto';

@ApiTags('Dissertations')
@Controller('dissertations')
export class DissertationsController {
  constructor(private service: DissertationsService) {}

  @Get()
  getAll(@Query() query: GetDissertationsDto) {
    return this.service.getDissertations(query);
  }

  @Get('count')
  getCount(@Query() query: GetDissertationsDto) {
    return this.service.countDissertations(query);
  }
}
