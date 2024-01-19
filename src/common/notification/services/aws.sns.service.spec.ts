import { Test, TestingModule } from '@nestjs/testing';
import { AwsSNSService } from './aws.sns.service';

describe('AwsSNSService', () => {
  let service: AwsSNSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsSNSService],
    }).compile();

    service = module.get<AwsSNSService>(AwsSNSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
