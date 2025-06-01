import { SendTemplatedEmailCommandOutput } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AWS_SES_EMAIL_TEMPLATES } from 'src/common/aws/enums/aws.ses.enum';
import { AwsSESService } from 'src/common/aws/services/aws.ses.service';
import { ISendEmailParams } from 'src/common/helper/interfaces/email.interface';
import { HelperEmailService } from 'src/common/helper/services/helper.email.service';

describe('HelperEmailService', () => {
    let service: HelperEmailService;
    let awsSESServiceMock: jest.Mocked<AwsSESService>;
    let configServiceMock: jest.Mocked<ConfigService>;
    let module: TestingModule;

    const mockFromEmail = 'noreply@example.com';

    beforeEach(async () => {
        awsSESServiceMock = {
            send: jest.fn(),
            getTemplate: jest.fn(),
            createTemplate: jest.fn(),
            deleteTemplate: jest.fn(),
        } as unknown as jest.Mocked<AwsSESService>;

        configServiceMock = {
            get: jest.fn().mockReturnValue(mockFromEmail),
        } as unknown as jest.Mocked<ConfigService>;

        module = await Test.createTestingModule({
            providers: [
                HelperEmailService,
                { provide: AwsSESService, useValue: awsSESServiceMock },
                { provide: ConfigService, useValue: configServiceMock },
            ],
        }).compile();

        service = module.get<HelperEmailService>(HelperEmailService);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        if (module) {
            await module.close();
        }
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('constructor', () => {
        it('should initialize fromEmail from ConfigService', () => {
            expect(configServiceMock.get).toHaveBeenCalledWith(
                'aws.ses.sourceEmail'
            );
        });

        it('should store the fromEmail value correctly', async () => {
            // Test that the fromEmail is used when sending emails
            const mockEmailParams: ISendEmailParams = {
                emailType: AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL,
                emails: ['user@example.com'],
                payload: { name: 'John Doe' },
            };

            const mockSendTemplatedEmailCommandOutput: SendTemplatedEmailCommandOutput =
                {
                    MessageId: 'mock-message-id',
                    $metadata: {},
                };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            await service.sendEmail(mockEmailParams);

            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: mockEmailParams.emails,
                sender: mockFromEmail,
                templateData: mockEmailParams.payload,
            });
        });
    });

    describe('sendEmail', () => {
        const mockEmailParams: ISendEmailParams = {
            emailType: AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL,
            emails: ['user@example.com'],
            payload: { name: 'John Doe' },
        };

        const mockSendTemplatedEmailCommandOutput: SendTemplatedEmailCommandOutput =
            {
                MessageId: 'mock-message-id',
                $metadata: {},
            };

        it('should send email successfully with all required parameters', async () => {
            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(mockEmailParams);

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: mockEmailParams.emails,
                sender: mockFromEmail,
                templateData: mockEmailParams.payload,
            });
            expect(awsSESServiceMock.send).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if email sending fails', async () => {
            const mockError = new Error('Email sending failed');
            awsSESServiceMock.send.mockRejectedValue(mockError);

            await expect(service.sendEmail(mockEmailParams)).rejects.toThrow(
                'Email sending failed'
            );
            expect(awsSESServiceMock.send).toHaveBeenCalledTimes(1);
        });

        it('should handle multiple recipients', async () => {
            const multipleRecipients = [
                'user1@example.com',
                'user2@example.com',
            ];
            const paramsWithMultipleRecipients = {
                ...mockEmailParams,
                emails: multipleRecipients,
            };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(
                paramsWithMultipleRecipients
            );

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: multipleRecipients,
                sender: mockFromEmail,
                templateData: mockEmailParams.payload,
            });
        });

        it('should handle empty payload', async () => {
            const paramsWithEmptyPayload = { ...mockEmailParams, payload: {} };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(paramsWithEmptyPayload);

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: mockEmailParams.emails,
                sender: mockFromEmail,
                templateData: {},
            });
        });

        it('should handle null payload', async () => {
            const paramsWithNullPayload = { ...mockEmailParams, payload: null };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(paramsWithNullPayload);

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: mockEmailParams.emails,
                sender: mockFromEmail,
                templateData: null,
            });
        });

        it('should handle undefined payload', async () => {
            const paramsWithUndefinedPayload = {
                ...mockEmailParams,
                payload: undefined,
            };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(paramsWithUndefinedPayload);

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: mockEmailParams.emails,
                sender: mockFromEmail,
                templateData: undefined,
            });
        });

        it('should use the correct email template', async () => {
            const customTemplate = AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL;
            const paramsWithCustomTemplate = {
                ...mockEmailParams,
                emailType: customTemplate,
            };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(paramsWithCustomTemplate);

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: customTemplate,
                recipients: mockEmailParams.emails,
                sender: mockFromEmail,
                templateData: mockEmailParams.payload,
            });
        });

        it('should handle single recipient as array', async () => {
            const singleRecipientParams = {
                ...mockEmailParams,
                emails: ['single@example.com'],
            };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(singleRecipientParams);

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: ['single@example.com'],
                sender: mockFromEmail,
                templateData: mockEmailParams.payload,
            });
        });

        it('should handle complex payload data', async () => {
            const complexPayload = {
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    preferences: {
                        language: 'en',
                        notifications: true,
                    },
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    source: 'test',
                },
            };

            const paramsWithComplexPayload = {
                ...mockEmailParams,
                payload: complexPayload,
            };

            awsSESServiceMock.send.mockResolvedValue(
                mockSendTemplatedEmailCommandOutput
            );

            const result = await service.sendEmail(paramsWithComplexPayload);

            expect(result).toEqual(mockSendTemplatedEmailCommandOutput);
            expect(awsSESServiceMock.send).toHaveBeenCalledWith({
                templateName: mockEmailParams.emailType,
                recipients: mockEmailParams.emails,
                sender: mockFromEmail,
                templateData: complexPayload,
            });
        });

        it('should handle AWS SES service errors properly', async () => {
            const awsError = new Error('AWS SES quota exceeded');
            awsError.name = 'SendingQuotaExceededException';

            awsSESServiceMock.send.mockRejectedValue(awsError);

            await expect(service.sendEmail(mockEmailParams)).rejects.toThrow(
                awsError
            );
            expect(awsSESServiceMock.send).toHaveBeenCalledTimes(1);
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network timeout');
            networkError.name = 'TimeoutError';

            awsSESServiceMock.send.mockRejectedValue(networkError);

            await expect(service.sendEmail(mockEmailParams)).rejects.toThrow(
                networkError
            );
            expect(awsSESServiceMock.send).toHaveBeenCalledTimes(1);
        });

        it('should return the exact response from AWS SES service', async () => {
            const detailedResponse: SendTemplatedEmailCommandOutput = {
                MessageId: 'detailed-message-id-12345',
                $metadata: {
                    httpStatusCode: 200,
                    requestId: 'request-id-12345',
                    attempts: 1,
                    totalRetryDelay: 0,
                },
            };

            awsSESServiceMock.send.mockResolvedValue(detailedResponse);

            const result = await service.sendEmail(mockEmailParams);

            expect(result).toEqual(detailedResponse);
            expect(result).toBe(detailedResponse); // Ensure it's the exact same object
        });
    });
});
