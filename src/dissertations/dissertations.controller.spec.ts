import { Test, TestingModule } from '@nestjs/testing';
import { DissertationsController } from './dissertations.controller';

describe('DissertationsController', () => {
  let controller: DissertationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DissertationsController],
    }).compile();

    controller = module.get<DissertationsController>(DissertationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
