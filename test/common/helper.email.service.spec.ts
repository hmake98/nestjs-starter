import { SendTemplatedEmailCommandOutput } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ENUM_EMAIL_TEMPLATES } from 'src/app/app.constant';
import { AwsSESService } from 'src/common/aws/services/aws.ses.service';
import { ISendEmailParams } from 'src/common/helper/interfaces/email.interface';
import { HelperEmailService } from 'src/common/helper/services/helper.email.service';

describe('HelperEmailService', () => {
  let service: HelperEmailService;
  let awsSESServiceMock: jest.Mocked<AwsSESService>;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    awsSESServiceMock = {
      send: jest.fn(),
    } as unknown as jest.Mocked<AwsSESService>;

    configServiceMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelperEmailService,
        { provide: AwsSESService, useValue: awsSESServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<HelperEmailService>(HelperEmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize fromEmail from ConfigService', () => {
      const mockEmail = 'test@example.com';
      configServiceMock.get.mockReturnValue(mockEmail);

      new HelperEmailService(awsSESServiceMock, configServiceMock);

      expect(configServiceMock.get).toHaveBeenCalledWith('aws.ses.sourceEmail');
    });
  });

  describe('sendEmail', () => {
    const mockEmailParams: ISendEmailParams = {
      emailType: ENUM_EMAIL_TEMPLATES.WELCOME_EMAIL,
      emails: ['user@example.com'],
      payload: { name: 'John Doe' },
    };

    const mockSendTemplatedEmailCommandOutput: SendTemplatedEmailCommandOutput = {
      MessageId: 'mock-message-id',
      $metadata: {},
    };

    it('should send email successfully', async () => {
      awsSESServiceMock.send.mockResolvedValue(mockSendTemplatedEmailCommandOutput);
      configServiceMock.get.mockReturnValue('noreply@example.com');

      const result = await service.sendEmail(mockEmailParams);

      expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
      expect(awsSESServiceMock.send).toHaveBeenCalledWith({
        templateName: mockEmailParams.emailType,
        recipients: mockEmailParams.emails,
        templateData: mockEmailParams.payload,
      });
    });

    it('should throw an error if email sending fails', async () => {
      const mockError = new Error('Email sending failed');
      awsSESServiceMock.send.mockRejectedValue(mockError);

      await expect(service.sendEmail(mockEmailParams)).rejects.toThrow('Email sending failed');
    });

    it('should handle multiple recipients', async () => {
      const multipleRecipients = ['user1@example.com', 'user2@example.com'];
      const paramsWithMultipleRecipients = { ...mockEmailParams, emails: multipleRecipients };

      awsSESServiceMock.send.mockResolvedValue(mockSendTemplatedEmailCommandOutput);

      await service.sendEmail(paramsWithMultipleRecipients);

      expect(awsSESServiceMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipients: multipleRecipients,
        }),
      );
    });

    it('should handle empty payload', async () => {
      const paramsWithEmptyPayload = { ...mockEmailParams, payload: {} };

      awsSESServiceMock.send.mockResolvedValue(mockSendTemplatedEmailCommandOutput);

      await service.sendEmail(paramsWithEmptyPayload);

      expect(awsSESServiceMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          templateData: {},
        }),
      );
    });

    it('should use the correct email template', async () => {
      const customTemplate = ENUM_EMAIL_TEMPLATES.WELCOME_EMAIL;
      const paramsWithCustomTemplate = { ...mockEmailParams, emailType: customTemplate };

      awsSESServiceMock.send.mockResolvedValue(mockSendTemplatedEmailCommandOutput);

      await service.sendEmail(paramsWithCustomTemplate);

      expect(awsSESServiceMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          templateName: customTemplate,
        }),
      );
    });
  });
});
