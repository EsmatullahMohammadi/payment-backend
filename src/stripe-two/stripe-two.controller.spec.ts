import { Test, TestingModule } from '@nestjs/testing';
import { StripeTwoController } from './stripe-two.controller';
import { StripeTwoService } from './stripe-two.service';

describe('StripeTwoController', () => {
  let controller: StripeTwoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeTwoController],
      providers: [StripeTwoService],
    }).compile();

    controller = module.get<StripeTwoController>(StripeTwoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
