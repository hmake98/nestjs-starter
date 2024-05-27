import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PublishCommand } from '@aws-sdk/client-sns';

import { TextMessageService } from '../../src/common/notification/services/text-message.service';

jest.mock('@aws-sdk/client-sns');

describe('TextMessageService', () => {
  let textMessageService: TextMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextMessageService, ConfigService],
    }).compile();

    textMessageService = module.get<TextMessageService>(TextMessageService);
    jest
      .spyOn(textMessageService['snsClient'], 'send')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(textMessageService).toBeDefined();
  });

  it('should send an SMS successfully', async () => {
    const phoneNumber = '+1234567890';
    const message = 'Test message';
    const expectedMessageId = 'messageId123';

    jest
      .spyOn(textMessageService['snsClient'], 'send')
      .mockResolvedValue({ MessageId: expectedMessageId } as never);

    const response = await textMessageService.sendSms(phoneNumber, message);

    expect(PublishCommand).toHaveBeenCalledWith({
      PhoneNumber: phoneNumber,
      Message: message,
    });
    expect(textMessageService['snsClient'].send).toHaveBeenCalled();
    expect(response).toEqual(expectedMessageId);
  });

  it('should throw an error when sending SMS fails', async () => {
    const phoneNumber = '+1234567890';
    const message = 'Test message';
    const errorMessage = 'Failed to send SMS';

    jest
      .spyOn(textMessageService['snsClient'], 'send')
      .mockRejectedValue(new Error(errorMessage) as never);

    await expect(
      textMessageService.sendSms(phoneNumber, message),
    ).rejects.toThrow(`Error sending SMS: ${errorMessage}`);
  });
});
