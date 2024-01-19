import { Test, TestingModule } from '@nestjs/testing';
import { AwsSESService } from './aws.ses.service';

describe('AwsSESService', () => {
  let service: AwsSESService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsSESService],
    }).compile();

    service = module.get<AwsSESService>(AwsSESService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
