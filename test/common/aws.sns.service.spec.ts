import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AwsSNSService } from 'src/common/aws/services/aws.sns.service';

jest.mock('@aws-sdk/client-sns');

describe('AwsSNSService', () => {
    let service: AwsSNSService;
    let configServiceMock: jest.Mocked<ConfigService>;
    let snsClientMock: jest.Mocked<SNSClient>;

    beforeEach(async () => {
        configServiceMock = {
            get: jest.fn((key: string) => {
                const config = {
                    'aws.accessKey': 'mockAccessKey',
                    'aws.secretKey': 'mockSecretKey',
                    'aws.region': 'us-west-2',
                };
                return config[key];
            }),
        } as unknown as jest.Mocked<ConfigService>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AwsSNSService,
                { provide: ConfigService, useValue: configServiceMock },
            ],
        }).compile();

        service = module.get<AwsSNSService>(AwsSNSService);
        snsClientMock = service[
            'snsClient'
        ] as unknown as jest.Mocked<SNSClient>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('constructor', () => {
        it('should initialize SNSClient with correct config', () => {
            expect(SNSClient).toHaveBeenCalledWith({
                credentials: {
                    accessKeyId: 'mockAccessKey',
                    secretAccessKey: 'mockSecretKey',
                },
                region: 'us-west-2',
            });
        });
    });

    describe('sendSms', () => {
        const phoneNumber = '+1234567890';
        const message = 'Test message';

        it('should send SMS successfully', async () => {
            const mockMessageId = 'mock-message-id';
            snsClientMock.send = jest
                .fn()
                .mockResolvedValue({ MessageId: mockMessageId });

            const result = await service.sendSms(phoneNumber, message);

            expect(result).toBe(mockMessageId);
            expect(snsClientMock.send).toHaveBeenCalledWith(
                expect.any(PublishCommand)
            );
            expect(PublishCommand).toHaveBeenCalledWith({
                PhoneNumber: phoneNumber,
                Message: message,
            });
        });

        it('should throw an error if SMS sending fails', async () => {
            const mockError = new Error('SMS sending failed');
            snsClientMock.send = jest.fn().mockRejectedValue(mockError);

            await expect(service.sendSms(phoneNumber, message)).rejects.toThrow(
                'SMS sending failed'
            );
        });

        it('should log success message when SMS is sent', async () => {
            const mockMessageId = 'mock-message-id';
            snsClientMock.send = jest
                .fn()
                .mockResolvedValue({ MessageId: mockMessageId });

            const logSpy = jest.spyOn(service['logger'], 'log');

            await service.sendSms(phoneNumber, message);

            expect(logSpy).toHaveBeenCalledWith(
                `SMS sent to ${phoneNumber} with MessageId: ${mockMessageId}`
            );
        });

        it('should log error message when SMS sending fails', async () => {
            const mockError = new Error('SMS sending failed');
            snsClientMock.send = jest.fn().mockRejectedValue(mockError);

            await expect(
                service.sendSms(phoneNumber, message)
            ).rejects.toThrow();
        });
    });
});
