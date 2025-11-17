import { SESClient } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { AwsSESService } from 'src/common/aws/services/aws.ses.service';

jest.mock('@aws-sdk/client-ses');

describe('AwsSESService', () => {
    let service: AwsSESService;
    let mockSesClient: jest.Mocked<SESClient>;
    let loggerMock: jest.Mocked<PinoLogger>;

    const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
            const config = {
                'aws.ses.credential.key': 'mock-key',
                'aws.ses.credential.secret': 'mock-secret',
                'aws.ses.region': 'mock-region',
            };
            return config[key];
        }),
    };

    beforeEach(async () => {
        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            trace: jest.fn(),
            fatal: jest.fn(),
            setContext: jest.fn(),
        } as unknown as jest.Mocked<PinoLogger>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AwsSESService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: PinoLogger,
                    useValue: loggerMock,
                },
            ],
        }).compile();

        service = module.get<AwsSESService>(AwsSESService);
        mockSesClient = service['sesClient'] as jest.Mocked<SESClient>;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getTemplate', () => {
        it('should return a template', async () => {
            const mockResponse = { Template: { TemplateName: 'Template1' } };
            mockSesClient.send.mockResolvedValue(mockResponse as never);

            const result = await service.getTemplate({ name: 'Template1' });

            expect(result).toEqual(mockResponse);
            expect(mockSesClient.send).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should throw error if AWS SDK throws', async () => {
            mockSesClient.send.mockRejectedValue(
                new Error('AWS Error') as never
            );

            await expect(
                service.getTemplate({ name: 'Template1' })
            ).rejects.toThrow('AWS Error');
        });
    });

    describe('createTemplate', () => {
        it('should create a template', async () => {
            const mockResponse = {};
            mockSesClient.send.mockResolvedValue(mockResponse as never);

            const result = await service.createTemplate({
                name: 'NewTemplate',
                subject: 'Test Subject',
                htmlBody: '<p>Test Body</p>',
            });

            expect(result).toEqual(mockResponse);
            expect(mockSesClient.send).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should throw error if body is null', async () => {
            await expect(
                service.createTemplate({
                    name: 'NewTemplate',
                    subject: 'Test Subject',
                })
            ).rejects.toThrow('Body is null');
        });

        it('should throw error if AWS SDK throws', async () => {
            mockSesClient.send.mockRejectedValue(
                new Error('AWS Error') as never
            );

            await expect(
                service.createTemplate({
                    name: 'NewTemplate',
                    subject: 'Test Subject',
                    htmlBody: '<p>Test Body</p>',
                })
            ).rejects.toThrow('AWS Error');
        });
    });

    describe('deleteTemplate', () => {
        it('should delete a template', async () => {
            const mockResponse = {};
            mockSesClient.send.mockResolvedValue(mockResponse as never);

            const result = await service.deleteTemplate({
                name: 'TemplateToDelete',
            });

            expect(result).toEqual(mockResponse);
            expect(mockSesClient.send).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should throw error if AWS SDK throws', async () => {
            mockSesClient.send.mockRejectedValue(
                new Error('AWS Error') as never
            );

            await expect(
                service.deleteTemplate({ name: 'TemplateToDelete' })
            ).rejects.toThrow('AWS Error');
        });
    });

    describe('send', () => {
        it('should send an email', async () => {
            const mockResponse = { MessageId: '12345' };
            mockSesClient.send.mockResolvedValue(mockResponse as never);

            const result = await service.send({
                recipients: ['recipient@example.com'],
                sender: 'sender@example.com',
                templateName: 'TestTemplate',
                templateData: { key: 'value' },
            });

            expect(result).toEqual(mockResponse);
            expect(mockSesClient.send).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should throw error if AWS SDK throws', async () => {
            mockSesClient.send.mockRejectedValue(
                new Error('AWS Error') as never
            );

            await expect(
                service.send({
                    recipients: ['recipient@example.com'],
                    sender: 'sender@example.com',
                    templateName: 'TestTemplate',
                })
            ).rejects.toThrow('AWS Error');
        });
    });
});
