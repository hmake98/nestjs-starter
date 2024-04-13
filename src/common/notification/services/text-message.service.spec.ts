import { Test, TestingModule } from '@nestjs/testing';
import { TextMessageService } from './text-message.service';
import { ConfigService } from '@nestjs/config';

describe('TextMessageService', () => {
  let textMessageService: TextMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextMessageService, ConfigService],
    }).compile();

    textMessageService = module.get<TextMessageService>(TextMessageService);
  });

  it('should be defined', () => {
    expect(textMessageService).toBeDefined();
  });
});
