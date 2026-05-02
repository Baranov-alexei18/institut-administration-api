import { Test, TestingModule } from '@nestjs/testing';
import { DissertationsService } from './dissertations.service';

describe('DissertationsService', () => {
  let service: DissertationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DissertationsService],
    }).compile();

    service = module.get<DissertationsService>(DissertationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
